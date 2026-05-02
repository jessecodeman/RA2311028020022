const BASE_URL = 'http://20.207.122.201/evaluation-service';
const TYPE_WEIGHT = {
  'Placement': 3,
  'Result': 2,
  'Event': 1
};

async function getTop10Notifications() {
  try {
    const authData = {
      email: "ap0902@srmist.edu.in",
      name: "adhil p sajeedh",
      rollNo: "ra2311028020022",
      accessCode: "QkbpxH",
      clientID: "c38ef7a1-d14b-4489-91a9-a9ae6db12dea",
      clientSecret: "gfatQvhYVHgJYqxM"
    };
    
    // 1. Authenticate
    const authRes = await fetch(`${BASE_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authData)
    });
    const authResult = await authRes.json();
    const token = authResult.access_token;
    
    // 2. Fetch notifications
    const res = await fetch(`${BASE_URL}/notifications`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await res.json();
    const notifications = data.notifications || [];
    
    // 3. Sort by priority (Weight then Recency)
    notifications.sort((a, b) => {
      const weightA = TYPE_WEIGHT[a.Type] || 0;
      const weightB = TYPE_WEIGHT[b.Type] || 0;
      
      if (weightA !== weightB) {
        return weightB - weightA; // Higher weight first
      }
      
      // If same type, sort by timestamp (newest first)
      const timeA = new Date(a.Timestamp).getTime();
      const timeB = new Date(b.Timestamp).getTime();
      return timeB - timeA;
    });
    
    // 4. Get Top 10
    const top10 = notifications.slice(0, 10);
    
    // 5. Display
    console.log('\n======================================================');
    console.log('             TOP 10 PRIORITY NOTIFICATIONS            ');
    console.log('======================================================\n');
    top10.forEach((notif, index) => {
      console.log(`${(index + 1).toString().padStart(2, ' ')}. [${notif.Type}] ${notif.Message}`);
      console.log(`    Time: ${notif.Timestamp} | ID: ${notif.ID}`);
      console.log('------------------------------------------------------');
    });
    
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
  }
}

getTop10Notifications();
