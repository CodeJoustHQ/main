package com.rocketden.main.controller.v1;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

// Redirects non-API routes to the frontend to avoid Spring 404 errors
@Controller
public class FrontendRedirectController {

    // Catch all non-static resources (routes without a period)
    @RequestMapping(value = "/**/{path:[^.]*}")
    public String redirect() {
        // Forward to home page so that route is preserved.
        return "forward:/";
    }
}
