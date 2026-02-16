import UIKit
import React
import React_RCTAppDelegate
@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // Force local bundle URL for debugging
    #if DEBUG
    // Simulator on local host. For device debug, update with your LAN IP (e.g. 192.168.x.x)
    let jsCodeLocation = URL(string: "http://127.0.0.1:8081/index.bundle?platform=ios&dev=true")!
    NSLog("DEBUG: Initializing RCTRootView with DEBUG URL: %@", jsCodeLocation.absoluteString)
    #else
    // Release builds load from the app bundle
    let jsCodeLocation = Bundle.main.url(forResource: "main", withExtension: "jsbundle")!
    NSLog("RELEASE: Initializing RCTRootView with LOCAL bundle: %@", jsCodeLocation.absoluteString)
    #endif

    let rootView = RCTRootView(
      bundleURL: jsCodeLocation,
      moduleName: "AppodealExample",
      initialProperties: nil,
      launchOptions: launchOptions
    )
    
    let rootViewController = UIViewController()
    rootViewController.view = rootView

    self.window = UIWindow(frame: UIScreen.main.bounds)
    self.window?.rootViewController = rootViewController
    self.window?.makeKeyAndVisible()

    return true
  }
}

// Remove the delegate class as it is no longer used
// class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate { ... }
