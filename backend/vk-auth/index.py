import json
import os
import hashlib
import psycopg2
from typing import Dict, Any
from urllib.parse import parse_qs

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Авторизация через ВКонтакте и сохранение пользователя в БД
    Args: event - dict с httpMethod, body, queryStringParameters
          context - объект с атрибутами request_id и др.
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        vk_id = body_data.get('vk_id')
        first_name = body_data.get('first_name')
        last_name = body_data.get('last_name')
        photo_url = body_data.get('photo_url', '')
        sign = body_data.get('sign', '')
        
        if not all([vk_id, first_name, last_name]):
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Missing required fields'}),
                'isBase64Encoded': False
            }
        
        vk_secret = os.environ.get('VK_SECRET_KEY', '')
        check_string = f"{vk_id}{vk_secret}"
        valid_sign = hashlib.md5(check_string.encode()).hexdigest()
        
        if sign != valid_sign:
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid signature'}),
                'isBase64Encoded': False
            }
        
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO users (vk_id, first_name, last_name, photo_url)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (vk_id) 
            DO UPDATE SET first_name = EXCLUDED.first_name, 
                         last_name = EXCLUDED.last_name,
                         photo_url = EXCLUDED.photo_url
            RETURNING id, vk_id, first_name, last_name, photo_url
        ''', (vk_id, first_name, last_name, photo_url))
        
        user = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        
        user_token = hashlib.sha256(f"{user[0]}{vk_secret}{user[1]}".encode()).hexdigest()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'id': user[0],
                'vk_id': user[1],
                'first_name': user[2],
                'last_name': user[3],
                'photo_url': user[4],
                'token': user_token
            }),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
