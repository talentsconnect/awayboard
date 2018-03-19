# Awayboard

"The Awayboard" is a dashboard-like overview for teams, whose members may work remotely, 
to know which team member is working from where.

Draggable photo-like tiles of team-members can be placed in columns
for office, homeoffice and away.

![Screenshot displaying main features of the application](assets/screenshot.png)

## Usage
Enter a name and an image-url (has to be somewhere online), click "Add person".
Then drag your tile to the desired column.

After that, tiles are stored permanently, so every person may update their working status accordingly.


## Installation
1. Build a docker image

    `$ docker build . -t awayboard `
    
2. Run it with published port. That can be changed in the Dockerfile.

    `$ docker run -p 5711:5711 awayboard`
