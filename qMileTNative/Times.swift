//
//  Times.swift
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

class Times: UIViewController, UICollectionViewDelegate, UICollectionViewDataSource, UICollectionViewDelegateFlowLayout, ADBannerViewDelegate{
    @IBOutlet weak var timesCollectionView: UICollectionView!
    
    func collectionView(collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAtIndexPath indexPath: NSIndexPath) -> CGSize {
        return CGSizeMake(self.view.bounds.width, 32);
    }
    
    func collectionView(collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        let appDel: AppDelegate = UIApplication.sharedApplication().delegate as! AppDelegate;
        let context: NSManagedObjectContext = appDel.managedObjectContext!;
        let fetch = NSFetchRequest(entityName: "TimeData");
        var times: Array<AnyObject> = [];
        
        do {
            try times = context.executeFetchRequest(fetch);
        } catch {
            print("Eror in collection view");
        }
        
        return times.count;
    }
    
    func collectionView(collectionView: UICollectionView, cellForItemAtIndexPath indexPath: NSIndexPath) -> UICollectionViewCell {
        let appDel: AppDelegate = UIApplication.sharedApplication().delegate as! AppDelegate;
        let context: NSManagedObjectContext = appDel.managedObjectContext!;
        let fetch = NSFetchRequest(entityName: "TimeData");
        var times: Array<AnyObject>;
        let cell:CollectionViewCell = collectionView.dequeueReusableCellWithReuseIdentifier("cell", forIndexPath: indexPath) as! CollectionViewCell;
        
        do {
            times = try context.executeFetchRequest(fetch);
        } catch {
            print("Error collectionview");
        }
        //let ip = indexPath;
        
        let data: NSManagedObject = times[indexPath.row] as! NSManagedObject;
        
        cell.col1Label.text = data.valueForKeyPath("quarter") as? String;
        cell.col2Label.text = data.valueForKeyPath("sixty") as? String;
        cell.col3Label.text = data.valueForKeyPath("hundred") as? String;
        
        return cell;
    }
    
    func collectionView(collectionView: UICollectionView, didHighlightItemAtIndexPath indexPath: NSIndexPath) {
        let appDel: AppDelegate = UIApplication.sharedApplication().delegate as! AppDelegate;
        let context: NSManagedObjectContext = appDel.managedObjectContext!;
        let fetch = NSFetchRequest(entityName: "TimeData");
        var times: Array<AnyObject>
        
        do {
            times = try context.executeFetchRequest(fetch);
        } catch {
            print("Error setting timesArray in CollectionView");
        }
        
        let alertController = UIAlertController(title: "Delete Time?", message: "Time cannot be recovered after it's deleted.", preferredStyle: UIAlertControllerStyle.Alert);
        let alertAction = UIAlertAction(title: "YES", style: UIAlertActionStyle.Destructive){ (action) in
            context.deleteObject(times[indexPath.row] as! NSManagedObject);
            do { try context.save(); } catch { print("Error collectionView context.save"); }
            self.timesCollectionView.reloadData(); //refresh table after delete
            print("Deleted Time");
        }
        let alertActionTwo = UIAlertAction(title: "CANCEL", style: UIAlertActionStyle.Cancel, handler: nil);
        
        alertController.addAction(alertAction);
        alertController.addAction(alertActionTwo);
        presentViewController(alertController, animated: true, completion: nil);
    }
    
    func bannerViewDidLoadAd(banner: ADBannerView!) {
        banner.hidden = false;
    }
    func bannerView(banner: ADBannerView!, didFailToReceiveAdWithError error: NSError!) {
        banner.hidden = true;
        print(error.localizedDescription);
    }
    
    override func viewDidLoad() {
        super.viewDidLoad();
        
        //self.canDisplayBannerAds = true;
    }
}
