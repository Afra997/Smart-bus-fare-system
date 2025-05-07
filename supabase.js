import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://udjogodbvehuqgrvhihz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkam9nb2RidmVodXFncnZoaWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MjAyNTIsImV4cCI6MjA2MjE5NjI1Mn0.myJkuEaz98bgRETxv3V1oPRf3WS5cuNDiO-qS3pdjkY';
const supabase = createClient(supabaseUrl, supabaseKey);


async function generateDummyData() {
  const { count } = await supabase
    .from('violations')
    .select('*', { count: 'exact', head: true });

  if (count > 0) return;

  const violations = [];
  const transactions = [];
  const violationTypes = ['noScan', 'fakeScan', 'incorrectCode', 'multipleAttempts'];
  const busRoutes = ['Route A', 'Route B', 'Route C', 'Route D'];
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i)); // Last 30 days
    
    const dailyViolations = Math.floor(Math.random() * 4) + 2;
    for (let v = 0; v < dailyViolations; v++) {
      violations.push({
        type: violationTypes[Math.floor(Math.random() * violationTypes.length)],
        bus_id: `bus${Math.floor(Math.random() * 4) + 1}`,
        passenger_id: `pass${Math.floor(Math.random() * 5) + 1}`,
        created_at: date.toISOString()
      });
    }

    const dailyTransactions = Math.floor(Math.random() * 11) + 10;
    for (let t = 0; t < dailyTransactions; t++) {
      transactions.push({
        amount: (10 + Math.random() * 30).toFixed(2),
        passenger_id: `pass${Math.floor(Math.random() * 5) + 1}`,
        bus_id: `bus${Math.floor(Math.random() * 4) + 1}`,
        created_at: date.toISOString()
      });
    }
  }

  await supabase.from('violations').insert(violations);
  await supabase.from('transactions').insert(transactions);
}

async function getDashboardData() {
  try {
    await generateDummyData();

    const { count: passengers } = await supabase
      .from('passengers')
      .select('*', { count: 'exact', head: true });

    const today = new Date().toISOString().split('T')[0];
    const { count: violationsToday } = await supabase
      .from('violations')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today);

    const { data: todayTransactions } = await supabase
      .from('transactions')
      .select('amount')
      .gte('created_at', today);
    const todayRevenue = todayTransactions?.reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

    const { data: recentTransactions } = await supabase
      .from('transactions')
      .select('amount, created_at, passengers(name)')
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: recentViolations } = await supabase
      .from('violations')
      .select('type, created_at, buses(route)')
      .order('created_at', { ascending: false })
      .limit(5);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: revenueData } = await supabase
      .from('transactions')
      .select('amount, created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    const revenueByDay = {};
    revenueData?.forEach(t => {
      const date = new Date(t.created_at).toLocaleDateString();
      revenueByDay[date] = (revenueByDay[date] || 0) + parseFloat(t.amount);
    });

    return {
      kpis: {
        passengers: passengers || 0,
        journeys: Math.floor(Math.random() * 20) + 5, // Simulated active journeys
        revenue: todayRevenue.toFixed(2),
        violations: violationsToday || 0
      },
      chartData: Object.entries(revenueByDay).map(([date, amount]) => ({
        date,
        amount
      })),
      recentTransactions: recentTransactions || [],
      recentViolations: recentViolations || []
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}

export { supabase, getDashboardData };