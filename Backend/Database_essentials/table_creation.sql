USE social_media_db;

CREATE TABLE social_media_posts (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    hashtags VARCHAR(255),
    date_and_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    caption TEXT,
    file_link VARCHAR(255),
    reason TEXT
);
