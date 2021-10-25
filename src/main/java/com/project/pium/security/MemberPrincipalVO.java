package com.project.pium.security;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.project.pium.domain.SignDTO;
import lombok.extern.java.Log;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


@Log
public class MemberPrincipalVO implements UserDetails{


    private ArrayList<SignDTO> signDTOS;

    public MemberPrincipalVO(ArrayList<SignDTO> userAuthes) {
        this.signDTOS = userAuthes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { //유저가 갖고 있는 권한 목록
        log.info("#유저의 정보 넘어오는지 확인"+signDTOS);

        List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
        for(int i=0; i<signDTOS.size(); i++) {
            authorities.add(new SimpleGrantedAuthority(signDTOS.get(i).getAuthorities_name()));
            log.info("#유저의 authorities(권한): "+signDTOS.get(i).getAuthorities_name());
        }
        return authorities;
    }

    @Override
    public String getPassword() { //유저 비밀번호

        return signDTOS.get(0).getMember_pw();
    }

    @Override
    public String getUsername() {// 유저 이름 혹은 아이디

        return signDTOS.get(0).getMember_email();
    }


    @Override
    public boolean isAccountNonExpired() {// 유저 아이디가 만료 되었는지

        return true;
    }

    @Override
    public boolean isAccountNonLocked() { // 유저 아이디가 Lock 걸렸는지

        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() { //비밀번호가 만료 되었는지

        return true;
    }

    @Override
    public boolean isEnabled() { // 계정이 활성화 되었는지

        return true;
    }


}