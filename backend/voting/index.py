import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Получение номинаций, подсчёт голосов и голосование
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
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Token, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor()
    
    if method == 'GET':
        cursor.execute('''
            SELECT 
                n.id, n.slug, n.title, n.description, n.icon, n.color,
                COUNT(v.id) as vote_count
            FROM nominations n
            LEFT JOIN votes v ON n.id = v.nomination_id
            GROUP BY n.id, n.slug, n.title, n.description, n.icon, n.color
            ORDER BY n.id
        ''')
        
        nominations = []
        for row in cursor.fetchall():
            nominations.append({
                'id': row[0],
                'slug': row[1],
                'title': row[2],
                'description': row[3],
                'icon': row[4],
                'color': row[5],
                'votes': row[6]
            })
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'nominations': nominations}),
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        headers = event.get('headers', {})
        user_id = headers.get('x-user-id') or headers.get('X-User-Id')
        
        if not user_id:
            cursor.close()
            conn.close()
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'User not authenticated'}),
                'isBase64Encoded': False
            }
        
        body_data = json.loads(event.get('body', '{}'))
        nomination_id = body_data.get('nomination_id')
        
        if not nomination_id:
            cursor.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Missing nomination_id'}),
                'isBase64Encoded': False
            }
        
        try:
            cursor.execute('''
                INSERT INTO votes (user_id, nomination_id)
                VALUES (%s, %s)
                ON CONFLICT (user_id, nomination_id) DO NOTHING
                RETURNING id
            ''', (user_id, nomination_id))
            
            result = cursor.fetchone()
            conn.commit()
            
            if result:
                cursor.execute('''
                    SELECT COUNT(*) FROM votes WHERE nomination_id = %s
                ''', (nomination_id,))
                vote_count = cursor.fetchone()[0]
                
                cursor.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'vote_count': vote_count
                    }),
                    'isBase64Encoded': False
                }
            else:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 409,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Already voted for this nomination'}),
                    'isBase64Encoded': False
                }
        except Exception as e:
            cursor.close()
            conn.close()
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)}),
                'isBase64Encoded': False
            }
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
