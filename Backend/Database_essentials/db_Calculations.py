'''
Author: Sounak Banerjee (TEAM UNIQUE)
email: sendtosounakbaanerjee@gmail.com

'''
#import necessary packages
from collections import Counter
import mysql.connector

#Function to Connect to the database
def create_connection():
    try:
        connection = mysql.connector.connect(
            host="35.192.96.185",
            user="root",
            password="Dorkarnei0toPASSWORD",
            database="social_media_db"
        )
        if connection.is_connected():
            #print("Connected to the database!")
            return connection
    except mysql.connector.Error as e:
        print(f"Error: {e}")
        return None
    
    
#Function to insert data into the database using MySQL connector
def insert_data(user_name,file_link,caption, hashtags,status,reason ):
    connection = create_connection()
    if connection:
        try:
            cursor = connection.cursor()
            sql_query = """
            INSERT INTO social_media_posts (user_name,file_link,caption, hashtags,status,reason)
            VALUES (%s, %s, %s, %s, %s, %s)
            """
            values = (user_name,file_link,caption, hashtags,status,reason)
            cursor.execute(sql_query, values)
            connection.commit()
            print("Data inserted successfully.")
        except mysql.connector.Error as e:
            print(f"Error: {e}")
        finally:
            cursor.close()
            connection.close()


#Function for deleting data from database table

def delete_data(user_id):
    connection = create_connection()
    if connection:
        try:
            cursor = connection.cursor()
            sql_query = "DELETE FROM social_media_posts WHERE user_id = %s"
            cursor.execute(sql_query, (user_id,))
            connection.commit()
            print(f"Record with User ID {user_id} deleted successfully.")
        except mysql.connector.Error as e:
            print(f"Error: {e}")
        finally:
            cursor.close()
            connection.close()




#Function to calculate total entries
def get_total_entries():
    
    connection = create_connection()
    if connection:
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT COUNT(*) FROM social_media_posts")
            total_entries = cursor.fetchone()[0]
            print(f"Total entries in the database: {total_entries}")
            return int(total_entries)
        
        except mysql.connector.Error as e:
            print(f"Error: {e}")
        finally:
            cursor.close()
            connection.close()


#Function to calculate total unapproved posts

def get_unapproved_count():
    
    connection = create_connection()
    if connection:
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT COUNT(*) FROM social_media_posts WHERE status = 'Rejected'")
            unapproved_count = cursor.fetchone()[0]
            print(f"Number of Unapproved Posts: {unapproved_count}")
            return int(unapproved_count)
        
        except mysql.connector.Error as e:
            print(f"Error: {e}")
        finally:
            cursor.close()
            connection.close()
            
            
            
#Function to calculate approaval rate

def calculate_approval_rate():
    
    total_entries = get_total_entries()
    unapproved_count = get_unapproved_count()

    if total_entries == 0:
        print("No posts available.")
        return 0.0

    approved_count = total_entries - unapproved_count
    approval_rate = (approved_count / total_entries) * 100
    print(f"Approval Rate: {approval_rate:.2f}%")
    return float(approval_rate)



#Code to Get file type 
def get_file_type(file_link):
    if not file_link:
        return "Unknown"
    
    image_extensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']
    video_extensions = ['mp4', 'mov', 'avi', 'mkv', 'flv']

    extension = file_link.split('.')[-1].lower()
    if extension in image_extensions:
        return "Image"
    elif extension in video_extensions:
        return "Video"
    else:
        return "Unknown"


#code to fetch all data from database
def retrieve_data():
    connection = create_connection()
    if connection:
        try:
            cursor = connection.cursor()
            cursor.execute("""
                SELECT user_name, file_link, date_and_time, caption, hashtags, status
                FROM social_media_posts
            """)
            
            records = cursor.fetchall()

            result = []
            for row in records:
                file_type = get_file_type(row[1])
                result.append({
                    "username": row[0],
                    "file_link": row[1],
                    "file_type": file_type,
                    "date_and_time": row[2],
                    "caption": row[3],
                    "hashtags": row[4],
                    "status": row[5]
                })
            return result
        except mysql.connector.Error as e:
            print(f"Error: {e}")
            return []
        finally:
            cursor.close()
            connection.close()


'''
#retrieve data for one user from database
def retrieve_data_for_user(username):
    connection = create_connection()
    if connection:
        try:
            cursor = connection.cursor()
            query = """
                SELECT user_name, file_link, date_and_time, caption, hashtags, status
                FROM social_media_posts
                WHERE user_name = %s
            """
            cursor.execute(query, (username,))
            records = cursor.fetchall()

            if not records:
                return (f"No records found for user: {username}")

            result = []
            for row in records:
                file_type = get_file_type(row[1])
                result.append({
                    "username": row[0],
                    "file_link": row[1],
                    "file_type": file_type,
                    "date_and_time": row[2],
                    "caption": row[3],
                    "hashtags": row[4],
                    "status": row[5]
                })
            return result

        except mysql.connector.Error as e:
            return f"Error: {e}"
        finally:
            cursor.close()
            connection.close()
'''

#Function to calculate Frequancy of hashtags and return most used and least used hashtags as dictionary
#from collections import Counter

def analyze_hashtag_frequency():
    connection = create_connection()
    if connection:
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT hashtags FROM social_media_posts")
            hashtags_list = []

            for row in cursor.fetchall():
                if row[0]:
                    hashtags_list.extend(row[0].split())

            if not hashtags_list:
                return {"most_used": None, "least_used": None}
            
            hashtag_counts = Counter(hashtags_list)
            
            most_used = hashtag_counts.most_common(5)
            #least_used = min(hashtag_counts.items(), key=lambda x: x[1])

            frequency = {
                "most_used": [{"hashtag": tag, "count": count} for tag, count in most_used],
                #"least_used": {"hashtag": least_used[0], "count": least_used[1]}
            }
            
            return frequency

        except mysql.connector.Error as e:
            print(f"Error: {e}")
            return {"most_used": None, "least_used": None}
        finally:
            cursor.close()
            connection.close()
            
            
            
            

