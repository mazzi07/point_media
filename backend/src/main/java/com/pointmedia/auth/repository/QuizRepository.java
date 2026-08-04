package com.pointmedia.auth.repository;

import com.pointmedia.auth.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
}
