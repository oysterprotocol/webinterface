blocker.bringToFront
isStageFive = no
	
# Define and set custom device
Framer.Device.customize
	deviceType: Framer.Device.Type.Computer
	devicePixelRatio: 1
	screenWidth: 1440
	screenHeight: 1082
	deviceImage: "http://f.cl.ly/items/001L0v3c1f120t0p2z24/custom.png"
	deviceImageWidth: 1440
	deviceImageHeight: 1082



#Button Hover States

#Main Upload button
Upload_Button.on Events.MouseOver, ->
	Upload_Button.animate
		backgroundColor: "#FFF"
		borderWidth: "2px"
		borderColor: "#1D79FB"
		options:
			time: 0.3
	UploadText.animate
		color: "#1D79FB"
			
Upload_Button.on Events.MouseOut, ->
	Upload_Button.animate
		backgroundColor: "#1D79FB"
		borderWidth: "0px"
		options:
			time: 0.3
	UploadText.animate
		color: "#FFF"


#Stage 2 Call to Action button	
S2_Button_Background.on Events.MouseOver, ->
	S2_Button_Background.animate
		backgroundColor: "#FFF"
		borderWidth: "2px"
		borderColor: "#1D79FB"
		options:
			time: 0.3
	Stage_2_CTA_Text.animate
		color: "#1D79FB"
			
S2_Button_Background.on Events.MouseOut, ->
	S2_Button_Background.animate
		backgroundColor: "#1D79FB"
		borderWidth: "0px"
		options:
			time: 0.3
	Stage_2_CTA_Text.animate
		color: "#FFF"


#Main retrieve button		
Retrieve_Button.on Events.MouseOver, ->
	Retrieve_Button.animate
		backgroundColor: "#FFF"
		borderWidth: "2px"
		borderColor: "#195FC5"
		options:
			time: 0.3
	RetrieveText.animate
		color: "#195FC5"

Retrieve_Button.on Events.MouseOut, ->
	Retrieve_Button.animate
		backgroundColor: "#195FC5"
		borderWidth: "0px"
		options:
			time: 0.3
	RetrieveText.animate
		color: "#FFF"
		
#Stage 3 Simulate Transaction Button
Simulate_Trans.on Events.MouseOver, ->
	Simulate_Trans.animate
		backgroundColor: "#FFF"
		borderWidth: "2px"
		borderColor: "#1D79FB"
		options:
			time: 0.3
	Stage_3_Simu_Text.animate
		color: "#1D79FB"
			
Simulate_Trans.on Events.MouseOut, ->
	Simulate_Trans.animate
		backgroundColor: "#1D79FB"
		borderWidth: "0px"
		options:
			time: 0.3
	Stage_3_Simu_Text.animate
		color: "#FFF"
		
#Stage 2 Retrieve Button 
Retrieve_Button_S2.on Events.MouseOver, ->
	S2_Retrieve_button_background.animate
		backgroundColor: "#FFF"
		borderWidth: "2px"
		borderColor: "#195FC5"
		options:
			time: 0.3
	Retrieve_Text.animate
		color: "#195FC5"

Retrieve_Button_S2.on Events.MouseOut, ->
	S2_Retrieve_button_background.animate
		backgroundColor: "#195FC5"
		borderWidth: "0px"
		options:
			time: 0.3
	Retrieve_Text.animate
		color: "#FFF"



#UPLOAD INDICATOR ANIMATION PROPERTIES
breatheIn = new Animation Ind_Inner_Circle,
	scale: 0.5
	point: Align.Center
	options: 
		time: 2
		curve: Bezier.easeOut

breatheOut = new Animation Ind_Inner_Circle,
	scale: 1
	point: Align.Center
	options: 
		time: 2
		curve: Bezier.easeOut
#Indicator - middle ring animation
Ind_Middle_Ring.animate
	rotation: 360
	options: 
		looping: yes
		time: 1
		curve: Bezier.linear
		
#Indicator - outer ring animation
Ind_Outer_Ring.animate
	rotation: 360
	options: 
		looping: yes
		time: 3
		curve: Bezier.linear



#RETRIEVE INDICATOR ANIMATION PROPERTIES
breatheInRetrieve = new Animation Retrieve_Ind_Inner_Circle,
	scale: 0.5
	point: Align.Center
	options: 
		time: 2
		curve: Bezier.easeOut

breatheOutRetrieve = new Animation Retrieve_Ind_Inner_Circle,
	scale: 1
	point: Align.Center
	options: 
		time: 2
		curve: Bezier.easeOut
#Indicator - middle ring animation
Retrieve_Ind_Middle_Ring.animate
	rotation: 360
	options: 
		looping: yes
		time: 1
		curve: Bezier.linear
		
#Indicator - outer ring animation
Retrieve_Ind_Outer_Ring.animate
	rotation: 360
	options: 
		looping: yes
		time: 3
		curve: Bezier.linear



#STAGE 2+ INITIAL VISIBILITY STATE -- This is mainly for getting the Framer prototype working. 
First_Stage.visible = yes

Stage_2_Upload.visible = no
Error_Message.visible = no
Error_Message.opacity = 0

Stage_3_Upload.visible = no
Stage_3_Upload.opacity = 1

Stage_4_Upload.visible = no
Stage_4_Upload.opacity = 0

Stage_5_Upload.visible = no
Stage_5_Upload.opacity = 0

Stage_6_Upload.visible = no
Stage_6_Upload.opacity = 0

Retrieve_Stage_2.visible = no

Stage_3_Retrieve.visible = no
Stage_3_Retrieve.opacity = 0

Retrieve_Stage_4.visible = no
Retrieve_Stage_4.opacity = 0








#STAGE 2 CONFIGURATION AND SETUP

#Code for the years of rentention slider
retentionSlider = new SliderComponent
	x: Slider.x
	y: Slider.y
	width: Slider.width
	height: Slider.height
	backgroundColor: Slider.backgroundColor
	parent: Stage_2_Upload
	

retentionSlider.knob.backgroundColor = Knob.backgroundColor
retentionSlider.knob.shadowX = Knob.shadowX
retentionSlider.knob.shadowY = Knob.shadowY
retentionSlider.fill.backgroundColor = "#1D79FB"
retentionSlider.knob.draggable.momentum = no

Slider.visible = no
Knob.visible = no

Years.text = 0

finalTally.template = 
	y: 0
	amount: 0

prlCost = 0


#Modulate the year value as the slider is changed
#the slider's value can be between 0 and 1. As the slider is moved, 
#the slider's value modulates the years of retention value between 0 and 15. 
#The 'yes' just limits the values to 0-15
retentionSlider.onValueChange ->
	Years.text = Math.round(Utils.modulate(retentionSlider.value, [0, 1], [0, 15], yes))
	finalTally.template =
		y: Years.text
		amount: Math.round(1 * Years.text)
	prlCost = finalTally.template.amount




#INITIAL STAGE TRANSITION TO UPLOAD OR RETRIEVE

#STAGE 1 ----> STAGE 2 TRANSITION

firstStageBezier = Bezier(0.785, 0.135, 0.15, 0.86)
firstStageTransitionTime = .8

#If the upload button is clicked...
Upload_Button.onTap ->
	#Slide in the transition rectangle, then decrease its width to 20px to be come the accent on the left side of interface
	Trans_Rectangle.animate
		x: Main_Rectangle.x
		options:
			curve: firstStageBezier 
			time: firstStageTransitionTime
	Utils.delay .7, ->
		First_Stage.visible = no
		Stage_2_Upload.visible = yes
		Trans_Rectangle.animate
			width: "20px"
			borderRadius:
				topRight: 0
				bottomRight: 0
			options:
				curve: firstStageBezier 
				time: firstStageTransitionTime

#If the retrieve button is clicked...
Retrieve_Button.onTap ->
	#Slide in the transition rectangle, then decrease its width to 20px to be come the accent on the left side of interface
	Trans_Rectangle.backgroundColor = "#195FC5"
	Trans_Rectangle.animate
		x: Main_Rectangle.x
		options:
			curve: firstStageBezier 
			time: firstStageTransitionTime
	
	Utils.delay .7, ->
		First_Stage.visible = no
		Retrieve_Stage_2.visible = yes
		Trans_Rectangle.animate
			width: "20px"
			borderRadius:
				topRight: 0
				bottomRight: 0
			options:
				curve: firstStageBezier 
				time: firstStageTransitionTime

#UPLOAD STAGES 

#STAGE 2 ---> STAGE 3 TRANSITION PLUS ERROR MESSAGE

Send_Prl_Text.template =
	num: 0
Start_Upload_Button_2_S2.onTap ->
	#Determines if the number of years/cost of PRL is greater than 0
	if prlCost is 0
		Trans_Rectangle.visible = no
		initBorderColor = Year_Border.borderColor
		Error_Message.visible = yes
		Error_Message.animate 
			opacity: 1
			options:
				time: 0.3
			Utils.delay 5, ->
				Error_Message.animate 
					opacity: 0
					options:
						time: 0.5
		Year_Border.animate 
			borderColor:"#F76868"
			options:
				time: 0.3
			Utils.delay 5, ->
				Year_Border.animate 
					borderColor: initBorderColor
					options:
						time: 0.3
				
		#Main_Rectangle refers to the main area of the interface. This code simulates the "head-shaking" interaction when 
		#an error occurs. Kinda like the Stripe payment interface when an error occurs. 
		Main_Rectangle.animate
			rotationY: 10
			options:
				time: 0.4
				curve: Spring
			Utils.delay 0.1, ->
				Main_Rectangle.animate
					rotationY: -10
					options:
						time: 0.4
						curve: Spring(damping: 0.77)
			Utils.delay 0.3, ->
				Main_Rectangle.animate
					rotationY: 0
					options:
						time: 0.4
						curve: Spring(damping: 0.77)
	else	
		Trans_Rectangle.visible = yes
		Send_Prl_Text.template =
			num: prlCost
		Stage_2_Upload.animate	
			opacity: 0
			options:
				time: 0.4
			Utils.delay 1, ->
				Stage_3_Upload.visible = yes
				Stage_3_Upload.animate
					opacity: 1
					options: 
						time: 1
						
						
						

#STAGE 3 ---> 4 AND STAGE 4 ---> 5 TRANSITION + 
#After tapping the SIMULATE TRANSACTION BUTTON...

#Progress: The first progress bar - Broker 1
#Progress_2: The second progress bar - Broker 2		
Simulate_Trans.onTap ->
	Stage_3_Upload.animate	
			opacity: 0
			options:
				time: 1
	Utils.delay 1, ->
		Stage_4_Upload.visible = yes
		Stage_4_Upload.animate
			opacity: 1
			options:
				time: 1
		#Start the breathing animation of the indicator's inner circle
		breatheIn.start()
		breatheIn.onAnimationEnd ->
			Utils.delay 1, ->
				breatheOut.start()
		breatheOut.onAnimationEnd ->
			Utils.delay 1, ->
				breatheIn.start()
	Utils.delay 8, ->
		Indicator.animate
			scale: 0
			opacity: 0
			options:
				time: 0.8
				curve: Spring(damping: 0.77)
	Utils.delay 8.2, ->
		Stage_4_Upload.animate
			opacity: 0
			options:
				time: 0.4
		Utils.delay 0.8, ->
			Stage_5_Upload.visible = yes
			Stage_5_Upload.animate
				opacity: 1
				options:
					time: 1
	isStageFive = yes
	Progress.width = 0
	Progress_2.width = 0
	Info_Text.template =
		message: "Sending chunks to brokers..."
	Broker_percent_1.template =
		percent: 0
	Broker_percent_2.template =
		percent: 0
		
	
	#If the prototype has made it to upload stage 5...
	if isStageFive is yes
		Utils.delay 10, ->
			Progress.animate
				width : Bar.width / 5
			Progress_2.animate
				width : Bar.width / 3	
			Info_Text.template =
				message: "Your file is now being uploaded to the Tangle."
			Broker_percent_1.template =
				percent: 20
			Broker_percent_2.template =
				percent: 33
			Utils.delay 2, ->
				Progress.animate
					width : Bar.width / 4
				Progress_2.animate
					width : Bar.width / 2
					Utils.delay 0.2, ->
						#animate the percent text to white as the bar gets close to 50%
						Broker_percent_2.animate
							color: "#FFF"
				Broker_percent_1.template =
					percent: 25
				Broker_percent_2.template =
					percent: 50
				Utils.delay 2, ->
					Progress.animate
						width : Bar.width / 2
						Utils.delay 0.2, ->
							#animate the percent text to white as the bar gets close to 50%
							Broker_percent_1.animate
								color: "#FFF"
					Progress_2.animate
						width : Bar.width / 1.33
					Broker_percent_1.template =
						percent: 50
					Broker_percent_2.template =
						percent: 75
					Utils.delay 2, ->
						Progress.animate
							width: Bar.width
							#Round off the corners as the progress bar gets to 100%
							borderRadius:
								topRight: 6
								bottomRight: 6
						Progress_2.animate
							width : Bar.width
							#Round off the corners as the progress bar gets to 100%
							borderRadius:
								topRight: 6
								bottomRight: 6
						Broker_percent_1.template =
							percent: 100
						Broker_percent_2.template =
							percent: 100
						Utils.delay 1, ->
							Stage_5_Upload.animate
								opacity: 0
								options:
									time: 0.4
							Utils.delay 0.8, ->
								Stage_6_Upload.visible = yes
								Stage_6_Upload.animate
									opacity: 1
									options:
										time: 1



#RETRIEVE STAGES

#STAGE 2 ---> STAGE 3 TRANSITION PLUS INDICATOR ANNIMATION (COPIED FROM UPLOAD, BASICALLY)

Retrieve_Button_S2.onTap ->
	Retrieve_Stage_2.animate	
			opacity: 0
			options:
				time: 1
	Utils.delay 1, ->
		Stage_3_Retrieve.visible = yes
		Stage_3_Retrieve.animate
			opacity: 1
			options:
				time: 1

		breatheInRetrieve.start()
		breatheInRetrieve.onAnimationEnd ->
			Utils.delay 1, ->
				breatheOutRetrieve.start()
		breatheOutRetrieve.onAnimationEnd ->
			Utils.delay 1, ->
				breatheIn.start()
	Utils.delay 8, ->
		Retrieve_Indicator.animate
			scale: 0
			opacity: 0
			options:
				time: 0.8
				curve: Spring(damping: 0.77)
	Utils.delay 8.2, ->
		Stage_3_Retrieve.animate
			opacity: 0
			options:
				time: 0.4
		Utils.delay 0.8, ->
			Retrieve_Stage_4.visible = yes
			Retrieve_Stage_4.animate
				opacity: 1
				options:
					time: 1
	