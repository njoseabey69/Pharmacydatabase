// Main application logic for PharmaSys

$(document).ready(function() {
    // Handle login
    $("#login-form").submit(function(e) {
        e.preventDefault();
        
        // Show loading spinner
        $("#loadingOverlay").addClass("show");
        
        // Get form values
        const username = $("#username").val();
        const password = $("#password").val();
        
        // Validate form
        let isValid = true;
        if (!username) {
            $("#username").addClass("is-invalid");
            isValid = false;
        } else {
            $("#username").removeClass("is-invalid");
        }
        
        if (!password) {
            $("#password").addClass("is-invalid");
            isValid = false;
        } else {
            $("#password").removeClass("is-invalid");
        }
        
        if (!isValid) {
            $("#loadingOverlay").removeClass("show");
            return;
        }
        
        // Simulate API call
        setTimeout(function() {
            // For demo purposes, we'll accept any login
            // Store user info in localStorage
            const userInfo = {
                id: 1,
                name: "John Doe",
                role: "Admin",
                token: "demo_token_12345"
            };
            
            localStorage.setItem("pharmaUserInfo", JSON.stringify(userInfo));
            
            // Hide login page, show app
            $("#login-page").hide();
            $("#app-page").show();
            
            // Update user info in the UI
            $("#user-name").text(userInfo.name);
            $("#user-role").text(userInfo.role);
            
            // Hide loading spinner
            $("#loadingOverlay").removeClass("show");
        }, 1000);
    });
    
    // Handle logout
    $("#logout-btn").click(function() {
        // Show loading spinner
        $("#loadingOverlay").addClass("show");
        
        // Simulate API call
        setTimeout(function() {
            // Clear user info from localStorage
            localStorage.removeItem("pharmaUserInfo");
            
            // Hide app, show login page
            $("#app-page").hide();
            $("#login-page").show();
            
            // Reset login form
            $("#login-form")[0].reset();
            
            // Hide loading spinner
            $("#loadingOverlay").removeClass("show");
        }, 1000);
    });
    
    // Navigation menu click handling
    $(".nav-link[data-page]").click(function() {
        const targetPage = $(this).data("page");
        
        // Update active navigation link
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
        
        // Hide all content sections and show the target one
        $(".content-section").removeClass("active");
        $("#" + targetPage + "-content").addClass("active");
    });
    
    // Sidebar toggle for responsive design
    $("#sidebar-toggle").click(function() {
        $(".sidebar").toggleClass("collapsed");
        $(".main-content").toggleClass("expanded");
        $(".topbar").toggleClass("expanded");
    });
    
    // Check if user is already logged in
    const storedUserInfo = localStorage.getItem("pharmaUserInfo");
    if (storedUserInfo) {
        const userInfo = JSON.parse(storedUserInfo);
        
        // Hide login page, show app
        $("#login-page").hide();
        $("#app-page").show();
        
        // Update user info in the UI
        $("#user-name").text(userInfo.name);
        $("#user-role").text(userInfo.role);
    }
});
