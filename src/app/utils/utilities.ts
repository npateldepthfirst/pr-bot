// Helper function to determine risk level from risk score
export const getRiskLevel = (riskScore: number): string => {
  if (riskScore >= 80) return 'Critical';
  if (riskScore >= 60) return 'High';
  if (riskScore >= 40) return 'Medium';
  if (riskScore >= 20) return 'Low';
  return 'None';
};

// Helper function to get risk color based on risk level (light background)
export const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'Critical':
      return 'bg-red-100 text-red-800';
    case 'High':
      return 'bg-orange-100 text-orange-800';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'Low':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-green-100 text-green-800';
  }
};

// Helper function to get risk color based on risk level (solid background)
export const getRiskColorSolid = (riskLevel: string) => {
  switch (riskLevel) {
    case 'Critical':
      return 'bg-red-500 text-white';
    case 'High':
      return 'bg-orange-500 text-white';
    case 'Medium':
      return 'bg-yellow-500 text-white';
    case 'Low':
      return 'bg-blue-500 text-white';
    default:
      return 'bg-green-500 text-white';
  }
};
