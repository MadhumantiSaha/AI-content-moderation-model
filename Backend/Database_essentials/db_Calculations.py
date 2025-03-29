'''
Author: Sounak Banerjee (TEAM UNIQUE)
email: sendtosounakbaanerjee@gmail.com

'''
#import necessary packages

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
                print("File Link:", row[2])
                print("Date and Time:", row[3])
                print("Caption:", row[4])
                print("Hashtags:", row[5])
                print("Status:", row[6])
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




#Function to calculate Frequancy of hashtags
def get_hashtag_frequency():
    pass
