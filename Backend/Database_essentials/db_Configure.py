'''
Author : Sounak Banerjee (TEAM UNIQUE)
email : sendtosounakbanerjee@gmail.com

'''
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
            print("Connected to the database!")
            return connection
    except mysql.connector.Error as e:
        print(f"Error: {e}")
        return None
    
    
#Function to insert data into the database using MySQL connector
def insert_data(user_name, hashtags,caption, file_link,):
    connection = create_connection()
    if connection:
        try:
            cursor = connection.cursor()
            sql_query = """
            INSERT INTO social_media_posts (user_name, hashtags, caption, file_link)
            VALUES (%s, %s, %s, %s)
            """
            values = (user_name, hashtags,caption, file_link)
            cursor.execute(sql_query, values)
            connection.commit()
            print("Data inserted successfully.")
        except mysql.connector.Error as e:
            print(f"Error: {e}")
        finally:
            cursor.close()
            connection.close()



#Function to retriev data from database

def fetch_data():
    connection = create_connection()
    if connection:
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT * FROM social_media_posts")
            records = cursor.fetchall()
            '''
            for row in records:
                print("User ID:", row[0])
                print("User Name:", row[1])
                print("Hashtags:", row[2])
                print("Date and Time:", row[3])
                print("Status:", row[4])
                print("Caption:", row[5])
                print("File Link:", row[6])
                print("Reason:", row[7])
                print("--------------------------")
            '''
            return records
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


