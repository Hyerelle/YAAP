#!/bin/bash 

cd ./website/js

rm libs.min.js && touch libs.min.js

libJS[0]=https://code.jquery.com/jquery-3.1.1.min.js
libJS[1]=https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.4.1/jquery.easing.min.js
libJS[2]=https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js
libJS[3]=https://cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/2.1.2/jquery.scrollTo.min.js
libJS[4]=https://cdnjs.cloudflare.com/ajax/libs/prism/1.6.0/prism.min.js

for (( i = 0 ; i < ${#libJS[@]} ; i++ )) 
do 
        file=${libJS[$i]}
        curl -sO $file
        cat $(basename ${file}) >> ./libs.min.js
        rm $(basename ${file})

        echo ✓ $(basename ${file})
done
sizeJS="$(ls -lh libs.min.js | awk '{print $5}')"
echo "> $sizeJS : lib.min.js generated"



cd ../style

rm libs.min.css && touch libs.min.css

libCSS[0]=http://fonts.googleapis.com/css?family=Lato:300,400,300italic,400italic
libCSS[1]=http://fonts.googleapis.com/css?family=Montserrat:400,700
libCSS[2]=https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css
libCSS[3]=https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css
libCSS[4]=https://cdnjs.cloudflare.com/ajax/libs/prism/1.6.0/themes/prism.min.css
libCSS[5]=https://cdnjs.cloudflare.com/ajax/libs/prism/1.6.0/themes/prism-okaidia.min.css
libCSS[6]=https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css

for (( i = 0 ; i < ${#libCSS[@]} ; i++ )) 
do 
        file=${libCSS[$i]}
        curl -sO $file
        cat $(basename ${file}) >> ./libs.min.css
        rm $(basename ${file})

        echo ✓ $(basename ${file})
done
sizeJS="$(ls -lh libs.min.css | awk '{print $5}')"
echo "> $sizeJS : lib.min.css generated"


unset libJS 
exit