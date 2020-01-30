# Surprise, surprise!
This repository is the starting point of the group project given in the elective course [Creative Coding at Politecnico di Milano](https://www4.ceda.polimi.it/manifesti/manifesti/controller/ManifestoPublic.do?EVN_DETTAGLIO_RIGA_MANIFESTO=evento&aa=2016&k_cf=19&k_corso_la=1092&k_indir=***&codDescr=050538&lang=IT&semestre=1&anno_corso=2&idItemOfferta=123381&idRiga=202553).

[Here](https://drawwithcode.github.io/2019/) you can see the assignments done by the students and the group projects, too.

Politecnico di Milano - Scuola del Design  
Faculty: Michele Mauri, Andrea Benedetti

![alt tag](../master/links/banner.png)

## The Idea  
The instructions for the group project of the Creative Coding course were to create an online space in which users could interact with each other.  
Our group decided to ponder about the concept of virtual space so we decided to create a space that was not only virtual but also physical; in this way the user could walk around using the geolocalization.  
We searched to see if there were already some applications similar to the one we had in mind (for example YakYak) to understand which were the critical points on the dynamics in a space where users can interact, to try and fix them.  
We found a recurring problem in online space: the total freedom of the user to say everything they want, which may contribute to transforming the online space in an hostile environment (cyber-bulling, etc).  
As a result we decided to create a space in which people could develop a higher sensibility through the expression of their emotions. The app is also Christmas themed because its purpose is very similar to the attitude people feel thanks to the Christmas atmosphere of kindness and gratefulness.

## The Project  
The interface of the app consists of a map in which the user has a limited possibility to move around; the user will also be able to leave some colorful packets around, with a special content hidden inside, which could be found and collected by other users using the app in the same area.

## Code challenges
From a coding point of view, having so many interactions based on the smartphone movements.
We tried to create different canvases, but weren’t able to upload the geolocation on the presets, as it not possible to have a preload function inside multiple canvasses. So we decided to use an if cycle to move from an interaction to another.  
Also, some of the features as frame count work differently from
Inspirations/References  
Our main inspirations have been the social-detox apps that help the users to reduce the time spent on social networks. Most of these apps mute the notifications or reward the users in different ways the less they use the smartphone.

## How does it work?
The user can through the map in any directions, but he will have some restrictions: he won’t be able to zoom back over a certain value, to discourage the user from exploring the places on the man that are not strictly surrounding. The user can move on the map as he moves around in real life; through a button located in the bottom part of the scree he can leave some packets around, which could be opened from other users that find them while exploring the map. The user will be able to leave a content of his choice hidden inside the gifts.

## The Content
The user will choose between three emojis to express his mood; in the packets there will be a short message representing the mood of the person who left it and an illustration, Christmas-themed, randomly chosen between five different ones. The one who will find the packets will get the chance to read the emotions of the person around him and in the meantime to collect the illustrations.

## The Challenge
Every time the user access the app, he will have the chance to collect all the different illustrations and to leave the packets around (so other users can collect them and the game can proceed) until he stays on the website.
Every time he reconnects he will have to start over.

## The Tools
* p5.js
* Mappa.js
* Mapbox

## The Team
* Niccolò Abate   
* Alvise Aspesi  
* Elisa Carbone  
* Davide Perucchini

>CREDITS  
>illustrations by [undraw.co](https://undraw.co/)
