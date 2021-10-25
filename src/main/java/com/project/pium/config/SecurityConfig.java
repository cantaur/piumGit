package com.project.pium.config;

import com.project.pium.security.SecurityService;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;

@Log
@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private SecurityService securityService;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Bean //실제 인증을 한 이후에 인증이 완료되면 Authentication객체를 반환을 위한 bean등록
    public DaoAuthenticationProvider authenticationProvider(SecurityService securityService) {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(securityService);
        authenticationProvider.setPasswordEncoder(bCryptPasswordEncoder);
        return authenticationProvider;
    }



    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.
                authenticationProvider(authenticationProvider(securityService));
    }



    @Override
    public void configure(WebSecurity web) throws Exception {
        //security 전역 설정.
        //HttpSecurity 보다 우선시 되며, static 파일 (css, js 같은) 인증이 필요없는 리소스는 이곳에서 설정 할 수 있다.
        web.ignoring().antMatchers("/css", "/js");
        web.ignoring().antMatchers("/resource/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().configurationSource(request -> new CorsConfiguration().applyPermitDefaultValues());
        http
                .csrf().disable()
                .authorizeRequests()
                .antMatchers("/**/*.{js,html,css}", "/", "/static/**").permitAll()
                .antMatchers("/built/**", "/images/**", "main.css", "/favicon*", "/site.webmanifest").permitAll()
                .antMatchers("/sign/**","/login","/ajax/**","/signUpConfirm", "/test").permitAll() //login 페이지는 모두에게 접근이 허용된다.
                .anyRequest().hasAnyRole("user") //이외의 어떠한 요청은 인증이 되어있어야 접근이 가능하다.
            //.and()
                //.csrf().ignoringAntMatchers("/sign/**") //기본적으로 springSecurity에선 post로 controller로 정보를 보내줄때 csrf라는 토큰이 필요한데 이것을 무시하기위한 경로
            .and()
                .formLogin()
                .loginPage("/login") //사용자가 정의한 로그인페이지로 이동
                //.usernameParameter("userEmail")
                //.passwordParameter("password")
                .defaultSuccessUrl("/project",true) //로그인 성공시 url
                .failureUrl("/sign/login/fail") //로그인 실패시 url
            .and()
                .logout()
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .clearAuthentication(true)
                .invalidateHttpSession(true)
            .and()
                .exceptionHandling()
                .accessDeniedPage("/access_denied");

    }
}
