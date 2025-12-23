import { TrendingUp, Users, MessageSquare, Heart } from 'lucide-react'

export default function StatsSection() {
  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: '50K+',
      label: 'Active Users',
      color: 'text-blue-500',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      value: '1M+',
      label: 'Profile Views',
      color: 'text-green-500',
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      value: '100K+',
      label: 'Messages Sent',
      color: 'text-purple-500',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      value: '98%',
      label: 'Satisfaction Rate',
      color: 'text-pink-500',
    },
  ]

  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Trusted by <span className="text-pink-600">Thousands</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition"
            >
              <div className={`${stat.color} flex justify-center mb-4`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

