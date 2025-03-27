'''
Author: Sounak Banerjee (TEAM UNIQUE)
email: sendtosounakbaanerjee@gmail.com

'''
#import necessary packages

import db_Configure

#Function to calculate total entries
def get_total_entries():
    
    connection = db_Configure.create_connection()
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
    
    connection = db_Configure.create_connection()
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
