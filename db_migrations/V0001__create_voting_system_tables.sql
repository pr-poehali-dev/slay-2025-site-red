-- Create users table for VK authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    vk_id BIGINT UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create nominations table
CREATE TABLE nominations (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create votes table (one vote per user per nomination)
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    nomination_id INTEGER REFERENCES nominations(id),
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, nomination_id)
);

-- Insert initial nominations
INSERT INTO nominations (slug, title, description, icon, color) VALUES
('meme', 'Мем года', 'Самый легендарный мем SIU', 'Laugh', 'from-red-600 to-red-900'),
('skin', 'Скин года', 'Самый стильный образ', 'Shirt', 'from-red-700 to-black'),
('breakthrough', 'Прорыв года', 'Самый яркий прорыв сезона', 'Rocket', 'from-red-500 to-red-800'),
('person_meme', 'Человек-мем года', 'Легенда, ставшая мемом', 'Smile', 'from-red-800 to-black');

-- Create index for faster vote counting
CREATE INDEX idx_votes_nomination ON votes(nomination_id);
CREATE INDEX idx_votes_user ON votes(user_id);