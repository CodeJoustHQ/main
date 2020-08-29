package com.rocketden.main.controller.v1;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

// Redirects non-API routes to the frontend to avoid Spring 404 errors
@Controller
public class FrontendRedirectController implements ErrorController {

    private static final String PATH = "/error";

    @RequestMapping(value = PATH)
    public String error() {
        return "forward:/index.html";
    }

    @Override
    public String getErrorPath() {
        return PATH;
    }
}
