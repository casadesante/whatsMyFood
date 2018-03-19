## NoSQL Schema Design
The `noSQLASCIITableFiles` dir contains the ASCII table files, which can be used to modify the table structure in [ASCII table generator](http://www.tablesgenerator.com/text_tables), when needed in future.

### Users

```
+----------------+-----------+----------------------------------------+-----------------------------------+----------------+
|    Property    | Data Type |               Description              |              Remarks              | Required items |
|                |           |                                        |                                   |   at the time  |
|                |           |                                        |                                   |   of creation  |
+----------------+-----------+----------------------------------------+-----------------------------------+----------------+
|       _id      |    UUID   |                 user id                |                                   | no (automated) |
+----------------+-----------+----------------------------------------+-----------------------------------+----------------+
|   firebaseId   |    UUID   |     Unique ID given by the firebase    |                                   |       yes      |
+----------------+-----------+----------------------------------------+-----------------------------------+----------------+
|       age      |  Integer  |             Age of the user            |                                   |       yes      |
+----------------+-----------+----------------------------------------+-----------------------------------+----------------+
| profilePicture |   String  | File URL of the user's profile picture |                                   |       yes      |
+----------------+-----------+----------------------------------------+-----------------------------------+----------------+
|    userName    |   String  |            Name of the user            |                                   |       yes      |
+----------------+-----------+----------------------------------------+-----------------------------------+----------------+
|   restaurants  |   Array   |         Array of restaurant Ids        | Parent-Child relationship between |       no       |
|                |           |                                        |  Users & Restaurants collection.  |                |
+----------------+-----------+----------------------------------------+-----------------------------------+----------------+
|    createdAt   |   String  |            Date of creation            |     Timestamp of the creation     |  no (in code)  |
+----------------+-----------+----------------------------------------+-----------------------------------+----------------+
|    updatedAt   |   String  |            Date of updation            |     Timestamp of the updation     |  no (in code)  |
+----------------+-----------+----------------------------------------+-----------------------------------+----------------+
```

### Restaurants

```
+----------------+-----------+---------------------------------------------+---------------------------+----------------+
|    Property    | Data Type |                 Description                 |          Remarks          | Required items |
|                |           |                                             |                           |   at the time  |
|                |           |                                             |                           |   of Creation  |
+----------------+-----------+---------------------------------------------+---------------------------+----------------+
|       _id      |    UUID   |                Restaurant id                |                           | no (automated) |
+----------------+-----------+---------------------------------------------+---------------------------+----------------+
|  restaurantId  |    UUID   | Unique restaurant id given by Google Places |   This will be received   |       yes      |
|                |           |                                             |   from google places API  |                |
+----------------+-----------+---------------------------------------------+---------------------------+----------------+
| restaurantName |   String  |            Name of the restaurant           |                           |       yes      |
+----------------+-----------+---------------------------------------------+---------------------------+----------------+
|     mapURL     |   String  |    URL of the restaurant, which actually    |                           |       yes      |
|                |           |         redirects to the Google Map         |                           |                |
+----------------+-----------+---------------------------------------------+---------------------------+----------------+
|    latitude    |   Float   |          Latitude of the restaurant         |                           |       yes      |
+----------------+-----------+---------------------------------------------+---------------------------+----------------+
|    longitude   |   Float   |         Longitude of the restaurant         |                           |       yes      |
+----------------+-----------+---------------------------------------------+---------------------------+----------------+
|    createdAt   |   String  |               Date of creation              | Timestamp of the creation |  no (in code)  |
+----------------+-----------+---------------------------------------------+---------------------------+----------------+
|    updatedAt   |   String  |               Date of updation              | Timestamp of the updation |  no (in code)  |
+----------------+-----------+---------------------------------------------+---------------------------+----------------+
```

### User-Restaurant-Menus

```
+--------------------------+-----------+------------------------------------------------+---------------------------------------------------------+----------------+
|         Property         | Data Type |                   Description                  |                         Remarks                         | Required items |
|                          |           |                                                |                                                         |   at the time  |
|                          |           |                                                |                                                         |   of Creation  |
+--------------------------+-----------+------------------------------------------------+---------------------------------------------------------+----------------+
|            _id           |    UUID   |             user-restaurant-menu id            |                                                         | no (automated) |
+--------------------------+-----------+------------------------------------------------+---------------------------------------------------------+----------------+
|        firebaseId        |    UUID   |             firebase id of the user            |    Child-Parent relationship between this collection    |       yes      |
|                          |           |                                                |                   and users collection                  |                |
+--------------------------+-----------+------------------------------------------------+---------------------------------------------------------+----------------+
|       restaurantId       |    UUID   |   Unique restaurant id given by Google Places  |    Child-Parent relationship between this collection    |       yes      |
|                          |           |                                                |  and restaurants collection. firebaseId + restaurantId  |                |
|                          |           |                                                |  forms a composite primary key in this collection. Both |                |
|                          |           |                                                | these values are required to uniquely identify a menu.  |                |
+--------------------------+-----------+------------------------------------------------+---------------------------------------------------------+----------------+
|           menus          |   Array   | Array of foods categorized by their experience |   The categories can be "not good", "very good", "ok",  |       yes      |
|                          |           |                                                |                     "good" & "bad".                     |                |
+--------------------------+-----------+------------------------------------------------+---------------------------------------------------------+----------------+
|  menus.<experience>.name |   String  |                Name of the food                |                                                         |       yes      |
+--------------------------+-----------+------------------------------------------------+---------------------------------------------------------+----------------+
| menus.<experience>.photo |   String  |        URL of the uploaded picture photo       |                                                         |     yes/no     |
+--------------------------+-----------+------------------------------------------------+---------------------------------------------------------+----------------+
|         createdAt        |   String  |                Date of creation                |                Timestamp of the creation                |  no (in code)  |
+--------------------------+-----------+------------------------------------------------+---------------------------------------------------------+----------------+
|         updatedAt        |   String  |                Date of updation                |                Timestamp of the updation                |  no (in code)  |
+--------------------------+-----------+------------------------------------------------+---------------------------------------------------------+----------------+
```
