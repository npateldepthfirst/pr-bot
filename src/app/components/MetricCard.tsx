interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
  onClick?: () => void;
}

export const MetricCard = ({ title, value, icon, gradient, iconBg, onClick }: MetricCardProps) => (
  <div 
    className={`bg-gradient-to-r ${gradient} p-6 rounded-xl shadow-lg text-white transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-xl hover:scale-105' : ''}`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium opacity-90">{title}</h3>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div className={`${iconBg} bg-opacity-30 p-3 rounded-lg`}>
        {icon}
      </div>
    </div>
    {onClick && (
      <div className="mt-3 pt-3 border-t border-white border-opacity-20">
        <div className="flex items-center justify-between">
          <span className="text-xs opacity-75">Click for details</span>
          <svg className="w-4 h-4 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    )}
  </div>
);

export default MetricCard;
