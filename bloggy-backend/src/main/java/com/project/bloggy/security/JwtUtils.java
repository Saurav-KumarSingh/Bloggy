package com.project.bloggy.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Base64;
import java.util.function.Function;

@Component
public class JwtUtils {

    // =============== JWT CONSTANTS ==================
    // Static Base64 Secret Key so it remains same even after server restart.
    private static final String SECRET = "bXlTdXBlclNlY3JldEtleUZvckpXVDEyMzQ1Njc4OTg3NjU0MzIx";
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 10; // 10 Hours

    // Convert Base64 string into real signing key
    private static Key getSigningKey() {
        byte[] keyBytes = Base64.getDecoder().decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // =============== GENERATE TOKEN ==================
    // Adds extra data (claims) like role or other info
    public String generateToken(String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role); // Custom Data
        return buildToken(claims, email);
    }



    private String buildToken(Map<String, Object> claims, String email) {
        return Jwts.builder()
                .setClaims(claims)                         // Extra Data
                .setSubject(email)                      // Username (Main Identity)
                .setIssuedAt(new Date(System.currentTimeMillis())) // Token Creation Time
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // Expiry Time
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // Signing with Secret Key
                .compact();                               // Convert to String
    }

    // =============== VALIDATE TOKEN ==================
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUserName(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // =============== EXTRACT DATA FROM TOKEN ==================
    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // =============== COMMON METHODS ==================
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
}
