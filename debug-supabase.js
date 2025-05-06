// Debug script to check Supabase connection and configuration
// Run with: node debug-supabase.js

require('dotenv').config({ path: '.env.local' });

async function debugSupabase() {
  try {
    console.log('Supabase Connection Debug Tool');
    console.log('==============================');
    
    // Check environment variables
    console.log('Environment Variables:');
    console.log('  SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Not set');
    console.log('  SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set');
    
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.log('\n❌ ERROR: Missing required Supabase environment variables');
      console.log('Make sure these are set in your .env.local file');
      return;
    }
    
    console.log('\nAttempting to connect to Supabase...');
    
    // Import Supabase client
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    
    // Check connection by running a simple query
    console.log('\nRunning connection test...');
    const { data, error } = await supabase.from('rsvps').select('*');
    
    if (error) {
      console.log('❌ Connection Error:', error.message);
      console.log('Error Details:', error);
      return;
    }
    
    console.log('✅ Successfully connected to Supabase!');
    
    // Get project info
    const { data: projectInfo, error: projectError } = await supabase.rpc('get_project_info');
    
    if (projectInfo) {
      console.log('\nProject Information:');
      console.log(projectInfo);
    } else if (projectError) {
      console.log('\nCould not get project info:', projectError.message);
    }
    
    // List tables
    const { data: tables, error: tablesError } = await supabase
      .from('pg_catalog.pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (tables) {
      console.log('\nAvailable Tables:');
      tables.forEach(table => console.log(`  - ${table.tablename}`));
    } else if (tablesError) {
      console.log('\nCould not list tables:', tablesError.message);
    }
    
    // Check RSVP data
    console.log('\nRSVP Data:');
    console.log(`  Total RSVPs: ${data ? data.length : 0}`);
    
    if (data && data.length > 0) {
      console.log('  RSVP Details:');
      data.forEach((rsvp, index) => {
        console.log(`    ${index + 1}. ${rsvp.name} (${rsvp.email}) - Event ID: ${rsvp.event_id}`);
      });
      
      // Get unique event IDs
      const eventIds = [...new Set(data.map(rsvp => rsvp.event_id))];
      console.log('  Event IDs with RSVPs:', eventIds);
    } else {
      console.log('  No RSVPs found in this database');
    }
    
  } catch (error) {
    console.error('Error in debug script:', error);
  }
}

debugSupabase();