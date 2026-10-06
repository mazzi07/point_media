package com.pointmedia.auth.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SpaWebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true);
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Forward SPA routes to index.html
        registry.addViewController("/sobre").setViewName("forward:/index.html");
        registry.addViewController("/vagas").setViewName("forward:/index.html");
        registry.addViewController("/quizzes").setViewName("forward:/index.html");
        registry.addViewController("/quizzes/**").setViewName("forward:/index.html");
        registry.addViewController("/criar-perfil").setViewName("forward:/index.html");
        registry.addViewController("/perfil").setViewName("forward:/index.html");
        registry.addViewController("/admin").setViewName("forward:/index.html");
        
        // Catch-all for other non-api routes (just in case)
        registry.addViewController("/{path:[^\\.]*}")
                .setViewName("forward:/index.html");
        registry.addViewController("/**/{path:[^\\.]*}")
                .setViewName("forward:/index.html");
    }
}
