package com.project.pium.controller;

import com.project.pium.domain.SignDTO;
import com.project.pium.security.SecurityService;
import com.project.pium.security.oauth2.NaverLoginBO;
import com.project.pium.service.MemberService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.github.scribejava.core.model.OAuth2AccessToken;
import lombok.extern.java.Log;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.security.Principal;
import java.util.HashMap;



/**
 * 회원가입을 위한 RestController (완료)
 * 인증메일 컨펌
 * 소셜 로그인 구현
 * 앱 실행 시 세션값 프론트에 넘김
 */

@Log
@RestController
public class SignController {

    @Autowired
    private SecurityService userDetailsService;
    @Autowired
    private MemberService memberService;

    private NaverLoginBO naverLoginBO;


    @Autowired
    private void setNaverLoginBO(NaverLoginBO naverLoginBO) {
        this.naverLoginBO = naverLoginBO;
    }

    //local signup
    @PostMapping("/ajax/regist")
    public String saveUserInfo(@RequestBody SignDTO signDTO) throws Exception {

        String msg = userDetailsService.insertUser(signDTO);
        if(msg.equals("Duplicated")){
            log.info("중복된 이메일로 회원가입 시도");
            return "fail";
        }else{
            return "success";
        }
    }

    //roll "user"로 상태변경
    @PostMapping("/ajax/signUpConfirm")
    public void signUpConfirm(@RequestBody SignDTO signDTO){
        log.info("signDTO : "+signDTO);
        //email,authkey 일치할 경우 member_auth 테이블에 추가(==user 권한 생성)
        userDetailsService.updateUserRoll(signDTO);
    }



    //google signup, login
    @PostMapping("/ajax/google/login")
    public String saveUserGoogle(@RequestBody SignDTO signDTO, HttpServletRequest request) throws Exception {

        String msg = userDetailsService.signUpGoogle(signDTO);
        String mEmail=signDTO.getMember_email();
        if(msg.equals("loginGoogle")){ //이미 가입된 구글ID로 판별이 되었을 때 security 강제 로그인 시도
            String gEmail = memberService.findUserEmail(mEmail);
            UserDetails ckUserDetails = userDetailsService.loadUserByUsername(gEmail);
            Authentication authentication = new UsernamePasswordAuthenticationToken(ckUserDetails.getUsername(), ckUserDetails.getPassword(), ckUserDetails.getAuthorities());

            SecurityContext securityContext = SecurityContextHolder.getContext();
            securityContext.setAuthentication(authentication);
            HttpSession session = request.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);
            return "successGoogleLogin";
        }else{
            return "successGoogleSignup";
        }
    }




    //네이버아이디로 인증 URL을 생성하기 위해 pium앱 로그인페이지에서 호출되는 메소드
    @RequestMapping("/ajax/naver")
    public String login(HttpSession session) {

        String naverAuthUrl = naverLoginBO.getAuthorizationUrl(session);
        log.info("네이버:" + naverAuthUrl);

        return naverAuthUrl;
    }

    //네이버 로그인 성공시 callback호출 메소드
    @RequestMapping(value = "/sign/naverlogin")
    public String callback(@RequestParam String code, @RequestParam String state, HttpSession session, HttpServletRequest request) throws Exception {

        OAuth2AccessToken oauthToken;
        oauthToken = naverLoginBO.getAccessToken(session, code, state);
        log.info("#session"+session);
        log.info("#code"+code);
        log.info("#state"+state);


        ObjectNode userInfo = new ObjectMapper().readValue(naverLoginBO.getUserProfile(oauthToken), ObjectNode.class);
        log.info("#userInfo: "+userInfo);
        String pwd= userInfo.path("response").path("id").asText();
        String email= userInfo.path("response").path("email").asText();

        SignDTO signDTO = new SignDTO(-1,email,pwd,"naver",null,0,null);
        String msg = userDetailsService.signUpNaver(signDTO);
        if(msg.equals("loginNaver")){
            String mEmail = memberService.findUserEmail(email);
            UserDetails ckUserDetails = userDetailsService.loadUserByUsername(mEmail);
            Authentication authentication = new UsernamePasswordAuthenticationToken(ckUserDetails.getUsername(), ckUserDetails.getPassword(), ckUserDetails.getAuthorities());

            SecurityContext securityContext = SecurityContextHolder.getContext();
            securityContext.setAuthentication(authentication);
            session = request.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);
            return "<script type=\"text/javascript\">window.location.href=\"http://ec2-3-22-170-165.us-east-2.compute.amazonaws.com:8000/project\"</script>";
        }else{
            return "success";
        }

    }




    //앱 실행시 세션값이 있으면 프론트에 email과 seq 넘겨주고, 세션이 없으면 false 반환
    @GetMapping("/ajax/loginUser")
    public Object currentUserName(Principal principal) {

        if(principal ==null){
            return "false";

        }else{
            HashMap<String, Object> userInfo = new HashMap<>();
            String sessionEmail = principal.getName();
            long sessionSeq = memberService.findUserNo(sessionEmail);
            userInfo.put("email",sessionEmail);
            userInfo.put("seq",sessionSeq);
            return userInfo;
        }
    }
}
