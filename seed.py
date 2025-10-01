import json
import random
import uuid
from datetime import datetime, timedelta

# --- Configuration ---
NUM_REPOSITORIES = 8
NUM_PULL_REQUESTS = 75
ORG_NAME = "secure-corp"
BOT_LOGIN = "SecurityBot"

# --- Sample Data Pools ---
ADJECTIVES = ["auth", "payment", "user", "notification", "api", "data", "infra", "search"]
NOUNS = ["service", "gateway", "engine", "handler", "manager", "pipeline", "proxy", "core"]
VERBS = ["Refactor", "Implement", "Fix", "Update", "Improve", "Add", "Remove"]
SUBJECTS = ["login logic", "caching layer", "API endpoint", "database schema", "user authentication"]
USER_LOGINS = ["jdoe", "asmith", "bwhite", "mgreen", "kblack", "dev-lead", "s-kim", "r-chen"]

VULNERABILITY_TYPES = [
    "SQL Injection", "Cross-Site Scripting (XSS)", "Insecure Deserialization",
    "Broken Authentication", "Sensitive Data Exposure", "Command Injection"
]
SEVERITIES = ["Critical", "High", "Medium", "Low"]
RESOLUTION_STATUSES = ["Needs Review", "Fix in Progress", "Resolved", "Risk Accepted"]

# --- Helper Functions ---

def generate_iso_time(start_date, max_delta_days=5):
    """Generates a random ISO 8601 timestamp."""
    delta = timedelta(
        days=random.randint(0, max_delta_days),
        hours=random.randint(1, 23),
        minutes=random.randint(1, 59)
    )
    return (start_date + delta).isoformat() + "Z"

def create_user_object(login):
    """Creates a user object that mimics the GitHub API structure."""
    user_id = random.randint(10000, 99999)
    return {
        "login": login,
        "id": user_id,
        "avatar_url": f"https://i.pravatar.cc/150?u={login}",
        "html_url": f"https://github.com/{login}"
    }

def create_security_analysis(pr_creation_time):
    """Generates the bot's findings for a PR."""
    analysis = []
    num_findings = random.choices([0, 1, 2, 3, 4], weights=[20, 40, 25, 10, 5], k=1)[0]
    for _ in range(num_findings):
        severity = random.choice(SEVERITIES)
        analysis.append({
            "id": str(uuid.uuid4()),
            "severity": severity,
            "vulnerability_type": random.choice(VULNERABILITY_TYPES),
            "file_path": f"src/{random.choice(ADJECTIVES)}/util/{random.choice(NOUNS)}.py",
            "line_number": random.randint(10, 200),
            "comment_created_at": generate_iso_time(datetime.fromisoformat(pr_creation_time[:-1]), 1)
        })
    return analysis

def calculate_pr_risk(security_analysis):
    """Calculates a numerical score and level based on findings."""
    score = 0
    if not security_analysis:
        return {"score": 0, "level": "None"}
    
    severity_scores = {"Critical": 10, "High": 5, "Medium": 2, "Low": 1}
    for finding in security_analysis:
        score += severity_scores.get(finding["severity"], 0)

    if score >= 15: level = "Critical"
    elif score >= 8: level = "High"
    elif score >= 2: level = "Medium"
    else: level = "Low"
    
    return {"score": score, "level": level}

# --- Main Generation Logic ---

def generate_mock_data(num_repos, total_prs):
    """Generates a full dashboard-ready dataset with nested PRs and analytics."""
    repositories = []
    repo_names = set()

    # 1. Create a list of unique repositories
    while len(repositories) < num_repos:
        repo_name = f"{random.choice(ADJECTIVES)}-{random.choice(NOUNS)}"
        if repo_name not in repo_names:
            repo_names.add(repo_name)
            repositories.append({
                "id": random.randint(1000000, 9999999),
                "name": repo_name,
                "full_name": f"{ORG_NAME}/{repo_name}",
                "html_url": f"https://github.com/{ORG_NAME}/{repo_name}",
                "private": random.choice([True, False]),
                "pull_requests": []
            })

    # 2. Generate PRs and assign them to repositories
    start_date = datetime.now() - timedelta(days=90)
    for i in range(total_prs):
        target_repo = random.choice(repositories)
        created_at = generate_iso_time(start_date)
        is_open = random.random() > 0.3
        
        analysis = create_security_analysis(created_at)
        risk = calculate_pr_risk(analysis)

        pr = {
            "id": random.randint(100000, 999999),
            "number": len(target_repo['pull_requests']) + 101,
            "title": f"{random.choice(VERBS)} {random.choice(SUBJECTS)}",
            "state": "open" if is_open else "closed",
            "resolution_status": "Resolved" if not is_open else random.choice(RESOLUTION_STATUSES[:-2]),
            "html_url": f"{target_repo['html_url']}/pull/{i + 101}",
            "user": create_user_object(random.choice(USER_LOGINS)),
            "created_at": created_at,
            "additions": random.randint(5, 500),
            "deletions": random.randint(0, 200),
            "assignees": [create_user_object(random.choice(USER_LOGINS))] if random.random() > 0.3 else [],
            "risk_score": risk["score"],
            "risk_level": risk["level"],
            "security_analysis": analysis
        }
        target_repo['pull_requests'].append(pr)

    # 3. Calculate and inject analytics at the repository and summary levels
    summary_analytics = {
        "total_repositories": len(repositories),
        "total_pull_requests": total_prs,
        "open_prs_with_vulnerabilities": 0,
        "vulnerability_counts": {"Critical": 0, "High": 0, "Medium": 0, "Low": 0},
        "riskiest_repositories": []
    }
    
    for repo in repositories:
        repo_open_vulns = 0
        repo_vuln_counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
        total_risk_score = 0
        
        for pr in repo['pull_requests']:
            total_risk_score += pr['risk_score']
            if pr['state'] == 'open' and pr['risk_score'] > 0:
                repo_open_vulns += 1
                for finding in pr['security_analysis']:
                    severity = finding['severity']
                    if severity in repo_vuln_counts:
                        repo_vuln_counts[severity] += 1
                        summary_analytics["vulnerability_counts"][severity] += 1

        summary_analytics["open_prs_with_vulnerabilities"] += repo_open_vulns
        repo["analytics"] = {
            "total_prs": len(repo["pull_requests"]),
            "open_prs_with_vulnerabilities": repo_open_vulns,
            "risk_score": total_risk_score,
            "vulnerability_counts": repo_vuln_counts
        }

    # Determine riskiest repos for the summary
    sorted_repos = sorted(repositories, key=lambda r: r["analytics"]["risk_score"], reverse=True)
    summary_analytics["riskiest_repositories"] = [
        {"name": r["name"], "risk_score": r["analytics"]["risk_score"]} for r in sorted_repos[:3]
    ]

    return {
        "summary_analytics": summary_analytics,
        "repositories": repositories
    }

if __name__ == "__main__":
    print(f"Generating dashboard data for {NUM_REPOSITORIES} repositories...")
    data = generate_mock_data(NUM_REPOSITORIES, NUM_PULL_REQUESTS)

    with open("mock-data.json", "w") as f:
        json.dump(data, f, indent=2)

    print("✅ Successfully created mock-data.json for the security dashboard.")