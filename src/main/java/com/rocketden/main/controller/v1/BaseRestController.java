package com.rocketden.main.controller.v1;

import org.springframework.web.bind.annotation.RequestMapping;

// Sets the base path for API endpoints. Custom controllers should extend this class.
@RequestMapping("/api/v1")
public class BaseRestController {

    /**
     * Protected empty constructor to allow visibility from extended classes,
     * but also remove warning on Utility class having no constructor to hide
     * the implicit public one.
     */
    protected BaseRestController() {}

    // Constants to hold custom paths.
    public static final String BASE_URL = "/api/v1";
    public static final String BASE_SOCKET_URL = "/api/v1/socket";
}
