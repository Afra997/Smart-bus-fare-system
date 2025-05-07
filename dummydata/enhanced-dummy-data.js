import { supabase } from './supabase.js';

async function insertDummyData() {
  await supabase.from('transactions').delete();
  await supabase.from('violations').delete();
  await supabase.from('buses').delete();
  await supabase.from('passengers').delete();

  const { data: passengers } = await supabase.from('passengers').insert([
    { id: 'pass001', name: 'John Doe', email: 'john@example.com', phone: '8801712345678', wallet_number: '01712345678', wallet_provider: 'bKash' },
    { id: 'pass002', name: 'Jane Smith', email: 'jane@example.com', phone: '8801812345678', wallet_number: '01812345678', wallet_provider: 'Nagad' },
    { id: 'pass003', name: 'Bob Johnson', email: 'bob@example.com', phone: '8801912345678', wallet_number: '01912345678', wallet_provider: 'Rocket' },
    { id: 'pass004', name: 'Alice Brown', email: 'alice@example.com', phone: '8801612345678', wallet_number: '01612345678', wallet_provider: 'bKash' },
    { id: 'pass005', name: 'Charlie Wilson', email: 'charlie@example.com', phone: '8801512345678', wallet_number: '01512345678', wallet_provider: 'Nagad' }
  ]);

  const { data: buses } = await supabase.from('buses').insert([
    { id: 'bus001', route: 'Route A', driver: 'Driver X', capacity: 40, status: 'active', last_service: '2023-05-15' },
    { id: 'bus002', route: 'Route B', driver: 'Driver Y', capacity: 35, status: 'active', last_service: '2023-06-20' },
    { id: 'bus003', route: 'Route C', driver: 'Driver Z', capacity: 30, status: 'maintenance', last_service: '2023-04-10' },
    { id: 'bus004', route: 'Route D', driver: 'Driver W', capacity: 45, status: 'active', last_service: '2023-07-05' },
    { id: 'bus005', route: 'Route E', driver: 'Driver V', capacity: 38, status: 'active', last_service: '2023-08-12' }
  ]);

  const transactions = [];
  const transactionTypes = ['standard', 'student', 'senior', 'monthly_pass'];
  
  for (let i = 0; i < 150; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const transactionDate = new Date();
    transactionDate.setDate(transactionDate.getDate() - daysAgo);
    
    const passenger = passengers[Math.floor(Math.random() * passengers.length)];
    const bus = buses[Math.floor(Math.random() * buses.length)];
    const amount = (10 + Math.random() * 30).toFixed(2);
    const distance = (2 + Math.random() * 10).toFixed(1);
    const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
    
    transactions.push({
      id: `trans${1000 + i}`,
      passenger_id: passenger.id,
      bus_id: bus.id,
      amount: parseFloat(amount),
      distance: parseFloat(distance),
      type,
      created_at: transactionDate.toISOString()
    });
  }

  await supabase.from('transactions').insert(transactions);

  const violationTypes = ['noScan', 'fakeScan', 'incorrectCode', 'multipleAttempts'];
  const locations = ['Downtown', 'Uptown', 'Central Station', 'East Side', 'West End'];
  
  const violations = [];
  for (let i = 0; i < 30; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const violationDate = new Date();
    violationDate.setDate(violationDate.getDate() - daysAgo);
    
    const passenger = passengers[Math.floor(Math.random() * passengers.length)];
    const bus = buses[Math.floor(Math.random() * buses.length)];
    const type = violationTypes[Math.floor(Math.random() * violationTypes.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    violations.push({
      type,
      bus_id: bus.id,
      passenger_id: passenger.id,
      location,
      created_at: violationDate.toISOString()
    });
  }

  await supabase.from('violations').insert(violations);

  console.log('Dummy data inserted successfully!');
}

insertDummyData().catch(console.error);