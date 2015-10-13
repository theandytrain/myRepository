//
//  Main.swift
//  qMileTimerNative
//
//  Created by Andy on 2015-06-05.
//  Copyright (c) 2015 ANDY MANIVONG O/A POINT707 TECHNOLOGIES. All rights reserved.
//

import UIKit
import CoreLocation
import Foundation
import iAd
import CoreData

class Main: UIViewController, CLLocationManagerDelegate, ADBannerViewDelegate{
    //Globals
    var LM : CLLocationManager = CLLocationManager();
    let defaults : NSUserDefaults = NSUserDefaults.standardUserDefaults();
    
    //Structs
    struct globals{
        struct timing{
            static var startLocation:CLLocation = CLLocation();
            static var startTime:Double = 0;
            static var quartTime:Double = 0;
            static var sixtyTime:Double = 0;
            static var hundredTime:Double = 0;
        }
        struct flag{
            static var recording:Int = 0;
            static var quartFlag:Int = 0;
            static var sixtyFlag:Int = 0;
            static var hundredFlag:Int = 0;
        }
    }
    
    /************************************/
    /********** OUTLET CONTROL **********/
    /************************************/
    @IBOutlet weak var unitLabel: UIButton!
    @IBOutlet weak var armedLabel: UIButton!
    @IBOutlet weak var speedLabel: UILabel!
    @IBOutlet weak var saveLabel: UIButton!
    
    @IBOutlet weak var distanceLabel: UILabel!
    @IBOutlet weak var quarterLabel: UILabel!
    @IBOutlet weak var sixtyLabel: UILabel!
    @IBOutlet weak var hundredLabel: UILabel!
    /**************************************/
    /********** OUTLET CONTROL^^ **********/
    /**************************************/
    
    /************************************/
    /********** BUTTON ACTIONS **********/
    /************************************/
    @IBAction func armTapped(sender: AnyObject) {
        print("Arm Tapped");
        
        globals.flag.recording = 0;
        
        armControl(false);
    }
    
    @IBAction func saveTapped(sender: AnyObject) {
        print("Save Tapped");

        let appDel: AppDelegate = UIApplication.sharedApplication().delegate as! AppDelegate;
        let context: NSManagedObjectContext = appDel.managedObjectContext!;
        let entity = NSEntityDescription.entityForName("TimeData", inManagedObjectContext: context);
        
        let newTime = DataModel(entity: entity!, insertIntoManagedObjectContext: context);
        
        if (quarterLabel.text! == "Timing..." || quarterLabel.text! == "Ready!"){newTime.quarter = "DNF"}else{newTime.quarter = quarterLabel.text!}
        if (sixtyLabel.text! == "Timing..." || sixtyLabel.text! == "Ready!"){newTime.sixty = "DNF"}else{newTime.sixty = sixtyLabel.text!}
        if (hundredLabel.text! == "Timing..." || hundredLabel.text! == "Ready!"){newTime.hundred = "DNF"}else{newTime.hundred = hundredLabel.text!}
        
        do {
            try context.save();
        } catch {
            print("Error at save");
        }
        
        saveControl(false);
    }
    @IBAction func unitTapped(sender: AnyObject) {
        let unit = defaults.integerForKey("unit");
        
        if (unit == 0){
            defaults.setInteger(1, forKey: "unit");
            unitLabel.setTitle("MPH", forState: .Normal);
        } else if (unit == 1){
            defaults.setInteger(0, forKey: "unit");
            unitLabel.setTitle("KMPH", forState: .Normal);
        } else {
            defaults.setInteger(0, forKey: "unit");
            unitLabel.setTitle("KMPH", forState: .Normal);
        }
    }
    
    /**************************************/
    /********** BUTTON ACTIONS^^ **********/
    /**************************************/
    
    /*************************************/
    /********** SPEED FUNCTIONS **********/
    /*************************************/
    func locationManager(manager: CLLocationManager!, didUpdateLocations locations: [CLLocation]) {
        var speedKMPH:Double = manager.location!.speed*3.6; //meters per second converted to KMPH
        var speedMPH:Double = manager.location!.speed*2.23694; //meters per second converted to MPH
        let refLocation:CLLocation = manager.location!; //current location used as "reference"
        manager.stopUpdatingLocation();

        var formattedSpeed:String?=""; //Speed Format
        let formatter = NSNumberFormatter(); //Speed Format
        let unit = defaults.integerForKey("unit"); //unit holder KMPH/MPH
        var distance:Double = 0; // distance holder
        //var qTimeCur:Double=0,qTimeTotal:Double=0,sixtyTime:Double=0,hundredTime:Double=0;
        //current time, total time, sixty time, hundred time
        let currentTime = NSDate.timeIntervalSinceReferenceDate();
        
        formatter.minimumIntegerDigits = 1;
        formatter.minimumFractionDigits = 2;
        
        speedKMPH = round(speedKMPH*100)/100;
        speedMPH = round(speedMPH*100)/100;
        
        //Speed Display
        if (unit == 0){
            if (speedKMPH < 0){speedKMPH = 0}
            formattedSpeed = formatter.stringFromNumber(speedKMPH);
            speedLabel.text = "\(formattedSpeed!)";
        } else {
            if (speedMPH < 0){speedMPH = 0}
            formattedSpeed = formatter.stringFromNumber(speedMPH);
            speedLabel.text = "\(formattedSpeed!)";
        }
        
        if (speedMPH <= 0){ //user is stopped
            setLabel("ready");
            globals.flag.recording = 1;
            globals.flag.quartFlag = 0;
            globals.flag.sixtyFlag = 0;
            globals.flag.hundredFlag = 0;
            globals.timing.quartTime = 0;
            globals.timing.sixtyTime = 0;
            globals.timing.hundredTime = 0;
        } else if (speedMPH > 0 && globals.flag.recording == 1){ //user has started; set all reference points from here
            setLabel("timing");
            globals.flag.recording = 2;
            globals.timing.startLocation = refLocation;
            globals.timing.startTime = NSDate.timeIntervalSinceReferenceDate();
        } else if (speedMPH > 0 && globals.flag.recording == 2){ //user is still moving; measure distance and start timing; main timing function
            //Quarter Mile Time
            distance = 0;
            distance = manager.location!.distanceFromLocation(globals.timing.startLocation)*0.000621371; //convert meter to mile
            distance = round((distance*100))/100;
            //distanceLabel.text = "\(distance)";
            if (distance >= 0.25 && globals.flag.quartFlag == 0){
                globals.timing.quartTime = round((currentTime - globals.timing.startTime)*100)/100;
                if (unit == 1){
                    quarterLabel.text = "\(globals.timing.quartTime)s"+" @ "+"\(speedMPH)mph";
                } else {
                    quarterLabel.text = "\(globals.timing.quartTime)s"+" @ "+"\(speedKMPH)kmph";
                }
                saveControl(true);
                armControl(true);
                globals.flag.quartFlag = 1;
            }
            
            //Zero to Sixty Time
            if (speedMPH >= 60 && globals.flag.sixtyFlag == 0){
                globals.timing.sixtyTime = round((currentTime - globals.timing.startTime)*100)/100;
                sixtyLabel.text = "\(globals.timing.sixtyTime)s";
                saveControl(true);
                armControl(true);
                globals.flag.sixtyFlag = 1;
            }
            
            //Zero to Hundred Time
            if (speedMPH >= 100 && globals.flag.hundredFlag == 0){
                globals.timing.hundredTime = round((currentTime - globals.timing.startTime)*100)/100;
                hundredLabel.text = "\(globals.timing.hundredTime)s";
                saveControl(true);
                armControl(true);
                globals.flag.hundredFlag = 1;
            }
            //if ATF == true; notify user time will not be saved?
        }
        //println("Flag: \(globals.flag.recording)" + "| Speed: \(speedMPH)");
        manager.startUpdatingLocation();
    }
    func locationManager(manager: CLLocationManager, didFailWithError error: NSError) {
        print("Location Manager Error");
    }
    /***************************************/
    /********** SPEED FUNCTIONS^^ **********/
    /***************************************/
    
    /***********************************/
    /********** APP FUNCTIONS **********/
    /***********************************/
    func setLabel(setTo:String){
        switch (setTo){
            case "ready":
                quarterLabel.text = "Ready!";
                sixtyLabel.text = "Ready!";
                hundredLabel.text = "Ready!";
                break;
            case "timing":
                quarterLabel.text = "Timing...";
                sixtyLabel.text = "Timing...";
                hundredLabel.text = "Timing...";
                break;
            default:
                break;
        }
    }
    func setupQMile(){
        saveControl(false);
        armControl(false);
        setLabel("ready");
    }
    func saveControl(onOff:Bool){
        if (onOff == true){
            saveLabel.backgroundColor = UIColor.greenColor();
            saveLabel.enabled = true;
        } else {
            saveLabel.backgroundColor = UIColor.lightGrayColor();
            saveLabel.enabled = false;
        }
    }
    func armControl(onOff:Bool){
        if (onOff == true){
            armedLabel.backgroundColor = UIColor.redColor();
            armedLabel.enabled = true;
        } else {
            armedLabel.backgroundColor = UIColor.lightGrayColor();
            armedLabel.enabled = false;
        }
    }
    func bannerViewDidLoadAd(banner: ADBannerView!) {
        banner.hidden = false;
    }
    func bannerView(banner: ADBannerView!, didFailToReceiveAdWithError error: NSError!) {
        print(error.localizedDescription);
        banner.hidden = true;
    }
    /*************************************/
    /********** APP FUNCTIONS^^ **********/
    /*************************************/
    
    /*********************************/
    /********** VIEW LOADED **********/
    /*********************************/
    override func viewDidLoad() {
        super.viewDidLoad()
        let permissionState = CLLocationManager.authorizationStatus()
        let unit = defaults.integerForKey("unit");
        
        LM.delegate = self;
        LM.desiredAccuracy = kCLLocationAccuracyBest;
        
        setupQMile();
        
        if (unit == 0){
            unitLabel.setTitle("KMPH", forState: .Normal);
        } else if (unit == 1){
            unitLabel.setTitle("MPH", forState: .Normal);
        } else {
            defaults.setInteger(0, forKey: "unit");
            unitLabel.setTitle("KMPH", forState: .Normal);
        }
        
        if(permissionState == .NotDetermined){
            print("Authorization Denied: " + String(permissionState.rawValue));
            LM.requestWhenInUseAuthorization();
            print("Requesting...")
        } else {
            print("Authorization Granted: " + String(permissionState.rawValue));
            print("Beginning Updates...");
            LM.startUpdatingLocation();
        }

        //self.canDisplayBannerAds = true;
    }
    /***********************************/
    /********** VIEW LOADED^^ **********/
    /***********************************/
}

/*

    Steps (Using MPH for calculation; No need for dynamic units)
    -----
    1) if (speed <= 0){ //user is stopped
        setLabel("ready");
        globals.flag.recording = 0;
        globals.timing.quartTime = 0;
        globals.timing.sixtyTime = 0;
        globals.timing.hundredTime = 0;
    }
    2) else if (speed > 0 && globals.flag.recording == 0){ //user has started; set all reference points from here
        setLabel("timing");
        globals.flag.recording = 1;
        globals.timing.startLocation = refLocation;
        globals.timing.startTime = NSDate.timeIntervalSinceReferenceDate();
    }
    3) else if (speed > 0 && globals.flag.recording == 1){ //user is still moving; measure distance and start timing; main timing function
        //Quarter Mile Time
        distance = 0;
        distance = LM.location.distanceFromLocation(globals.startLocation)*0.000621371; //convert meter to mile
        distance = round((distance*100))/100;
        distanceLabel.text = "\(distance)";
        if (distance >= 0.25 && globals.flag.quartFlag == 0){
            globals.timing.quartTime = round((currentTime - globals.timing.startTime)*100)/100;
            if (unit == 1){
                quarterLabel.text = "\(globals.timing.quartTime)s"+" @ "+"\(speedMPH)mph";
            } else {
                quarterLabel.text = "\(globals.timing.quartTime)s"+" @ "+"\(speedKMPH)kmph";
            }
            globals.flag.quartFlag = 1;
        }
        //Zero to Sixty Time
            if (speedMPH >= 60 && globals.flag.sixtyFlag == 0){
            globals.timing.sixtyTime = round((currentTime - globals.timing.startTime)*100)/100;
            sixtyLabel.text = "\(globals.timing.sixtyTime)s";
            globals.flag.sixtyFlag = 1
        }
        //Zero to Hundred Time
        if (speedMPH >= 100 && globals.flag.hundredFlag == 0){
            globals.timing.hundredTime = round((currentTime - globals.timing.startTime)*100)/100;
            hundredLabel.text = "\(globals.timing.hundredTime)s";
            globals.flag.hundredFlag = 1
        }
    }
*/




