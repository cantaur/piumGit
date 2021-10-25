package com.project.pium.security;

import com.project.pium.domain.MemberDTO;
import com.project.pium.domain.SignDTO;
import com.project.pium.email.EmailSenderService;
import com.project.pium.mapper.MemberMapper;
import com.project.pium.mapper.SignMapper;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;


import java.util.ArrayList;
import java.util.List;


@Service
@Log
public class SecurityService implements UserDetailsService {

    @Autowired
    private SignMapper signMapper;
    @Autowired
    private MemberMapper memberMapper;
    @Autowired
    private EmailSenderService emailSenderService;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    /**
     * DB에서 유저정보를 불러와 Custom한 Userdetails 클래스를 리턴한다.
     */
    @Override
    public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
        log.info("#id : "+id);

        ArrayList<SignDTO> userAuthes = signMapper.findByUserId(id);
        log.info("#userAuthes"+userAuthes);
        log.info("#userAuthes size: "+userAuthes.size());

        if(userAuthes.size() == 0) {
            throw new UsernameNotFoundException("User "+id+" Not Found!");
        }
        return new MemberPrincipalVO(userAuthes);
    }

    /**
     * user 권한 생성(==member_auth 테이블에 추가)
     * local 회원가입 시 ->이메일 인증 완료되면->user 권한 생성
     * social 회원가입 시 ->user 권한 생성
     */
    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = {Exception.class})
    public String updateUserRoll(SignDTO signDTO){

            int userNo = signMapper.findUserNo(signDTO.getMember_email());
            log.info("#userNo : "+userNo);
            int roleNo = signMapper.findRoleNo("user");
            log.info("#roleNo : "+roleNo);
            signMapper.userRoleSave(userNo, roleNo);

        return "success";
    }
    
    //social(google) 회원가입 서비스
    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = {Exception.class})
    public String signUpGoogle(SignDTO signDTO) throws Exception{
        signDTO.setMember_pw(bCryptPasswordEncoder.encode(signDTO.getMember_pw())); //암호화
        log.info("#입력된 이메일주소: "+signDTO.getMember_email());
        log.info("#유저 비밀번호 :"+signDTO.getMember_pw());
        log.info("#플랫폼 : "+signDTO.getMember_platform());
        String platform= signDTO.getMember_platform();
        List<MemberDTO> userInfo = memberMapper.selectAllByEmail(signDTO.getMember_email());

        if(userInfo.size() !=0){
            log.info("이미 가입한 구글 사용자");
            //이미 가입된 정보가 있을 경우 spring security 강제 로그인으로 넘김
            return "loginGoogle";
        }else{
            if(platform.equals("google")){
                log.info("가입처리 진행");
                int flag = signMapper.signup(signDTO);
                log.info("#flag"+flag);
                updateUserRoll(signDTO);
                return "loginGoogle";
            }
        }
        return platform;
    }


    //social(naver) 회원가입 서비스
    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = {Exception.class})
    public String signUpNaver(SignDTO signDTO) throws Exception{
        signDTO.setMember_pw(bCryptPasswordEncoder.encode(signDTO.getMember_pw())); //암호화
        log.info("#입력된 이메일주소: "+signDTO.getMember_email());
        log.info("#유저 비밀번호 :"+signDTO.getMember_pw());
        log.info("#플랫폼 : "+signDTO.getMember_platform());
        String platform= signDTO.getMember_platform();
        List<MemberDTO> userInfo = memberMapper.selectAllByEmail(signDTO.getMember_email());

        if(userInfo.size() !=0){
            log.info("이미 가입한 네이버 사용자");
            //이미 가입된 정보가 있을 경우 spring security 강제 로그인으로 넘김
            return "loginNaver";
        }else{
            if(platform.equals("naver")){
                log.info("가입처리 진행");
                int flag = signMapper.signup(signDTO);
                log.info("#flag"+flag);
                updateUserRoll(signDTO);
                return "loginNaver";
            }
        }
        return platform;
    }





    




    //local 회원가입 서비스 : member 테이블에 추가, 인증 이메일 발송, 가입 대기 상태
    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = {Exception.class})
    public String insertUser(SignDTO signDTO) throws Exception{

        signDTO.setMember_pw(bCryptPasswordEncoder.encode(signDTO.getMember_pw())); //암호화
        log.info("#입력된 이메일주소: "+signDTO.getMember_email());
        log.info("#유저 비밀번호 :"+signDTO.getMember_pw());
        log.info("#플랫폼 : "+signDTO.getMember_platform());

        if(memberMapper.selectAllByEmail(signDTO.getMember_email()).size() !=0){
            return "Duplicated";

        }else{
            if(signDTO.getMember_platform().equals("pium")){
                int flag = signMapper.signup(signDTO);

                //임의의 authKey 생성 & 이메일 발송
                String authKey = emailSenderService.sendAuthMail(signDTO.getMember_email());
                log.info("#생성된 authkey"+authKey);
                signDTO.setAuthKey(authKey);
                String email = signDTO.getMember_email();
                String setAuthKey = signDTO.getAuthKey();
                signMapper.authkeySave(setAuthKey,email);

                return "success";
            }

        }
        return "fail";
    }
}
