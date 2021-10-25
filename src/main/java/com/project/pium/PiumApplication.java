package com.project.pium;


import com.project.pium.file.property.FileStorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;


@EnableConfigurationProperties({
		FileStorageProperties.class
})
@SpringBootApplication
public class PiumApplication {

	public static void main(String[] args) {
		SpringApplication.run(PiumApplication.class, args);
	}

}
