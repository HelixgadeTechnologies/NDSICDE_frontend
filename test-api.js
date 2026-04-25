const axios = require('axios');
const baseUrl = 'https://ndsicde-backend66.onrender.com';
async function run() {
  try {
    const res = await axios.get(`${baseUrl}/api/projectManagement/projects`);
    const project = res.data.data?.[0];
    if (!project) return console.log("No projects");
    const pid = project.id;
    console.log("Project ID:", pid);
    
    // Test 1
    try {
      const ind1 = await axios.get(`${baseUrl}/api/projectManagement/indicators/${pid}`);
      console.log("Test 1 success:", ind1.data.data?.length);
    } catch (e) {
      console.log("Test 1 failed", e.response?.status);
    }
    
    // Test 2
    try {
      const ind2 = await axios.get(`${baseUrl}/api/projectManagement/project-indicators/${pid}`);
      console.log("Test 2 success:", ind2.data.data?.length);
    } catch (e) {
      console.log("Test 2 failed", e.response?.status);
    }
    
  } catch(e) {
    console.log(e.message);
  }
}
run();
