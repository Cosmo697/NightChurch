// Simple script to test the RSVP endpoint
// Run with: node test-rsvp.js

async function testRsvp() {
  try {
    console.log('Testing RSVP API endpoint...');
    
    const testEventSlug = 'reconnect-and-rise'; // The event with existing RSVPs
    
    // First check how many RSVPs already exist for this event
    await checkRsvpCount(testEventSlug);
    
    // Create a new RSVP with a unique email
    const uniqueEmail = `test-${Date.now()}@example.com`;
    
    const response = await fetch('http://localhost:3000/api/events/rsvp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        eventSlug: testEventSlug,
        name: 'Test User',
        email: uniqueEmail,
        guests: 2,
        notes: 'Testing from Node.js script with fixed endpoint'
      })
    });
    
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log(`✅ RSVP created successfully for ${uniqueEmail}`);
      console.log(`Updated RSVP count: ${data.rsvpCount}`);
    } else {
      console.log('❌ RSVP test failed!');
    }
    
    // Check again after creating the new RSVP
    await checkRsvpCount(testEventSlug);
    
    // Debug mode - check ALL RSVPs in the system
    await debugAllRsvps();
    
  } catch (error) {
    console.error('Error during test:', error);
  }
}

// Helper function to check RSVP count for a specific event
async function checkRsvpCount(eventSlug) {
  try {
    console.log(`\nChecking RSVP count for event: ${eventSlug}`);
    
    const response = await fetch(`http://localhost:3000/api/events/rsvp?eventSlug=${eventSlug}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`Current RSVP count: ${data.count}`);
      
      if (data.rsvps && data.rsvps.length > 0) {
        console.log(`Found ${data.rsvps.length} RSVPs:`);
        data.rsvps.forEach((rsvp, index) => {
          console.log(`  ${index + 1}. ${rsvp.name} (${rsvp.email}) - ${rsvp.guests} guest(s)`);
        });
      } else {
        console.log('No RSVPs found for this event');
      }
    } else {
      console.log('❌ Failed to check RSVP count:', data.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error checking RSVP count:', error);
  }
}

// Debug function to see all RSVPs in the system
async function debugAllRsvps() {
  try {
    console.log('\n----- DEBUG: ALL RSVPS IN THE SYSTEM -----');
    
    const response = await fetch('http://localhost:3000/api/events/rsvp?debug=true');
    const data = await response.json();
    
    if (response.ok) {
      console.log(`Total RSVPs in database: ${data.totalCount}`);
      console.log(`Event IDs with RSVPs: ${JSON.stringify(data.eventIds)}`);
      
      if (data.rsvps && data.rsvps.length > 0) {
        console.log('\nAll RSVPs:');
        data.rsvps.forEach((rsvp, index) => {
          console.log(`  ${index + 1}. ${rsvp.name} (${rsvp.email}) - Event: ${rsvp.event_id}, Status: ${rsvp.status}`);
        });
      }
    } else {
      console.log('❌ Failed to debug all RSVPs:', data.message);
    }
    
    console.log('----- END DEBUG -----\n');
  } catch (error) {
    console.error('Error debugging all RSVPs:', error);
  }
}

// Run the test
testRsvp();