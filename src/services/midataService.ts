import { Injectable } from '@angular/core';
import { Midata, Resource} from 'Midata';
import { SecureStorage, SecureStorageObject } from "@ionic-native/secure-storage";
import { Events, Platform } from "ionic-angular";
import { Network } from "@ionic-native/network";
import {NativeStorage} from '@ionic-native/native-storage';
import { TokenRefreshResponse, TokenResponse } from "midata/dist/src/api";
import {Promise} from 'es6-promise';

@Injectable()
export class MidataService {

  private networkState: boolean;
  private resourceMap: Map<string, Resource>;
  private midata: Midata;

    constructor(
    	protected storage: NativeStorage,
    	protected secureStorage: SecureStorage,
    	protected platform: Platform,
    	protected events: Events,
    	protected network: Network
    ){

      this.events.subscribe('network:connected', (callback) => {
        this.onNetworkConnected(callback);
      });

      this.events.subscribe('network:disconnected', () => {
        this.onNetworkDisconnected();
      });

      this.events.subscribe('application:paused', (callback) => {
        this.onApplicationPaused(callback);
      });

      this.events.subscribe('application:resumed', (callback) => {
        this.onApplicationResumed(callback);
      });

      // TODO: Change platform
      this.midata = new Midata('https://test.midata.coop', 'migrEn', 'metal taste buzz bonus toy volume');

      platform.ready().then(() => {
        if (this.network.type === "none") {
          this.setNetworkState(false);
        } else {
          this.setNetworkState(true);
        }

        this.resourceMap = new Map<string, Resource>();

        this.getKeysfromSecureStorage()
          .then((keys) => {
          return this.initializeResourceMap(keys)
        })
          .then((values) => {
          for(let entry of values){
            this.addResource(entry);
          }
          console.log(`${this.resourceMap.size} entrie(s) loaded`);
        });
      })

    }

  /**
   * Get the current midata object
   * @returns The current midata object
   */
  private getConnection() : Midata {
    return this.midata;
    }

  /**
   * Get the current connection state
   * @returns Boolean describing the current connection state
   */
  getNetworkState() {
    console.log("MIDATA SRV", "get network state", this.networkState)
    return this.networkState;
  }

  /**
   * Set the connection state
   * @param flag
   */
  private setNetworkState(flag: boolean) {
    this.networkState = flag;
  }

  /**
   * Determine whether the user is authenticated
   * @returns Boolean predicating authentication state
   */
  loggedIn(): Boolean {
    return this.getConnection().loggedIn;
  }

  /**
   * Get the current refresh token
   * @returns String with the refreshToken
   */
  getRefreshToken(): string {
    return this.getConnection().refreshToken;
  }

  /**
   * Get the current auth token
   * @returns String with the authToken
   */
  getAuthToken(): string {
    return this.getConnection().authToken;
  }
  /**
   * Get the current user
   * @returns The current user
   */
  getUser() {
    return this.getConnection().user;
  }

  /**
   * Search a value on MIDATA
   * @param resourceType  Type of resource searched in MIDATA (for example "Observation")
   * @param params  Parameters to add to this request
   * @returns Promise of type Resource[]
   */
  search(resourceType: string, params: any = {}): Promise<Resource[]> {
    return this.getConnection().search(resourceType, params);
  }

  /**
   * Loads and returns current non-synchronized records from secure storage
   * @param keys  keys of records to be searched inside secure storage
   * @returns Promise of type Resource[]
   */
  private initializeResourceMap(keys : string[]) : Promise<Resource[]> {
    let promises : Promise<Resource>[] = [];
    for(let i = 0; i < keys.length; i++){
      promises[i] = this.getResourceFromSecureStorage(keys[i])
    }
    return Promise.all(promises).then((values) => {
      return Promise.resolve(values);
    })
  }

  /**
   * Adds a resource to the volatile resource map
   * @param r  Resource to be added
   */
  private addResource(r: Resource)  {
    this.resourceMap.set(r.getProperty('effectiveDateTime'), r);
  }

  /**
   * Removes a resource from the volatile resource map
   * @param key  Key of the resource to be removed
   */
  private removeResource(key: string){
    this.resourceMap.delete(key);
  }

  /**
   * Synchronizes records inside the volatile resource map onto MIDATA. This method also automatically
   * aligns the secure storage whenever a record was successfully synchronized
   * @param key  Key of the resource to be removed
   * @returns Promise of type Resource[]
   */
  public syncResourceMap() : Promise<Resource[]>{
    if(this.resourceMap.size == 0) {
      return Promise.resolve([]);
    } else {
    let promises: Promise<Resource>[]  = [];
      this.resourceMap.forEach((entry: Resource) => {
        let promise : Promise<Resource> = this.midata.save(entry)
          .then(() => {
            return this.removeResourceFromSecureStorage(entry.getProperty('effectiveDateTime'))
          })
          .then((key : string) => {
            this.removeResource(key);
            return Promise.resolve(entry);
          });
        promises.push(promise);
    });
      return Promise.all(promises).then((msg) => {
        return Promise.resolve(msg);
      })
    }
  }

  // TODO: Distinguish user
  /**
   * Returns a resource from secure storage given a key
   * @param key  Key of the resource to be returned
   * @returns Promise of type Resource
   */
  private getResourceFromSecureStorage(key: string): Promise<Resource> {
    return new Promise<Resource>((resolve, reject) =>{
      return this.secureStorage.create('UPSTREAM_RECORDS')
        .then((storage: SecureStorageObject) => {
          return storage.get(key);
        })
        .then((r) => {
          let record = JSON.parse(r);
          // manually re-set the prototype because it was removed
          // within secureStorage
          record.__proto__ = Resource.prototype;
          return resolve(record);
        }).catch((error) => {
          return reject(error);
        });
    });
  }

  /**
   * Returns all keys held inside the secure storage
   * @returns Promise of type string[]
   */
  private getKeysfromSecureStorage(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) =>{
      return this.secureStorage.create('UPSTREAM_RECORDS')
        .then((storage: SecureStorageObject) => {
          return resolve(storage.keys());
        })
        .catch(() => {
          return reject("Error allocating entries inside secure storage");
        })
    });
  }
  /**
   * Removes a record from the secure storage given a key
   * @returns Promise of type string
   */
  private removeResourceFromSecureStorage(key: string): Promise<string> {
    return new Promise<string>((resolve, reject) =>{
      return this.secureStorage.create('UPSTREAM_RECORDS')
        .then((storage: SecureStorageObject) => {
        // TODO: Transform to Resource...
          return resolve(storage.remove(key));
        })
        .catch(() => {
        return reject("Error deleting entry from secure storage");
        })
    });
  }

  /**
   * Save a resource onto MIDATA. Occasionally, records will instead be stored locally inside the
   * secure storage whenever there is network connection.
   * @param resource  Resource to be saved
   * @returns Promise of type Resource
   */
  save(resource: Resource | any) : Promise<Resource> {
    if (this.getNetworkState()) {
         return this.getConnection().save(resource)
          .then((rsp: Resource) => {
            return Promise.resolve(rsp);
          })
          .catch((error) => {
            return Promise.reject(error);
          })
    } else {
      return this.stageResourceForSynchronization(resource.getProperty('effectiveDateTime'), resource)
        .then((msg) => {
        this.addResource(resource);
        return Promise.resolve(msg);
      })
        .catch((error) => {
          return Promise.reject(error);
        })
    }

  }

  /**
   * Login to MIDATA using OAuth2
   * @returns Promise of type boolean
   */
  authenticate(): Promise<boolean> {
    if(this.getNetworkState()) {
      return this.getConnection().fetchFHIRConformanceStatement()
        .then(() => {
        return this.midata.authenticate();
        })
        .then((rsp : TokenResponse) => {
        return this.setSecureStorageToken(rsp.refresh_token);
        })
        .then(() => {
        this.syncResourceMap().catch(() => {
          // synchronize asynchronously.
          // Do not wait for the method to return.
          // However, on error log to console
          console.log("Error during synchronization process!");
        });
          return Promise.resolve(true);
        })
        .catch((err) => {
          console.warn(err);
        return Promise.reject(false);
        })
    } else {
      return Promise.reject(false);
    }
  }

  /**
   * (Re)opens a session with MIDATA using a refresh token to obtain and allocate new session
   * information. It can be used to reinforce automatic login upon start of the application.
   * This method, however, requires prior successful authentication on MIDATA. It will fail otherwise.
   * @returns Promise of type boolean
   */
  openSession() : Promise<boolean>{
    console.log("MIDATA SRV", "we are in open session function")
    if(this.getNetworkState()){
      return this.getConnection().fetchFHIRConformanceStatement()
        .then(() => {
          console.log("MIDATA SRV", "we got conformance statement")
          return this.refresh()
        })
        .then(() => {
          console.log("MIDATA SRV", "refresh did work...")
          this.syncResourceMap().catch(() => {
            // synchronize asynchronously.
            // Do not wait for the method to return.
            // However, on error log to console
            console.log("Error during synchronization process!");
          });
          return Promise.resolve(true);
        })
        .catch(() => {
        return Promise.reject(false);
        })
    } else {
      console.log("MIDATA SRV", "no network state")
      return this.getSecureStorageToken().then((msg) => {
        return Promise.resolve(true);
      }).catch((msg) => {
        return Promise.reject(false);
      })
    }
  }

  /**
   * Refreshes the session information namely both the authentication and the refresh token. Subsequently
   * stores the refresh token inside the secure storage for further use
   * @returns Promise of type any
   */
  // TODO: Return values of promise chain should be of type TokenRefreshResponse. This way, the
  // TODO: app.component can distinguish the error message and act appropriately.
    private refresh(): Promise<any> {
      console.log("MIDATA SRV", "we are in refresh function")
        let refreshToken: string;
        return this.getSecureStorageToken()
          .then((rT) => {
            console.log("MIDATA SRV", "got refresh token:", rT)
            if (rT === undefined || rT == '' || rT == null) {
              return Promise.reject('Error, refresh token not available inside secure storage');
            } else {
              refreshToken = rT;
            }
          })
          .then(() => {
            console.log("MIDATA SRV", "now executing refresh with token:", refreshToken)
            return this.midata.refresh(refreshToken);
          })
          .then((rsp : TokenRefreshResponse) => {
            console.log("MIDATA SRV", "got response from midata:", rsp)
            return this.setSecureStorageToken(rsp.refresh_token)
          })
          .then((msg) => {
            console.log("MIDATA SRV", "resolve witdh msg:", msg)
            return Promise.resolve(msg);
          })
          .catch((error) => {
            return Promise.reject(error);
          })
    }

  /**
   * Stores a given refresh token inside the secure storage
   * @param refreshToken The refresh token to be stored
   * @returns Promise of type any
   */
  private setSecureStorageToken(refreshToken: string): Promise<any> {
      return new Promise<String>((resolve, reject) =>{
        return this.secureStorage.create('MIDATA_CONNECTION_SERVICE')
          .then((storage: SecureStorageObject) => {
            return storage.set('refreshToken', refreshToken)
          })
          .then((data) => {
            return resolve(data);
          }).catch((error) => {
            return reject(error);
          })
      });
    }

  /**
   * Gets the refresh token held inside the secure storage
   * @returns Promise of type any
   */
    private getSecureStorageToken(): Promise<any> {
      return new Promise<String>((resolve, reject) =>{
        return this.secureStorage.create('MIDATA_CONNECTION_SERVICE')
              .then((storage: SecureStorageObject) => {
                return storage.get('refreshToken')
              })
              .then((data) => {
                return resolve(data);
              }).catch((error) => {
                return reject(error);
              })
      });
    }

  // TODO: Occasionally remove non-synchronized records from the secure storage (dependent on user's action).
  /**
   * Logout from MIDATA. Removes any session information and deletes the refresh token held
   * inside the secure storage
   * @returns Promise of type any
   */
    public logout(): Promise<any> {
        this.getConnection().logout();
        return new Promise((resolve, reject) => {
            this.secureStorage.create('MIDATA_CONNECTION_SERVICE')
                .then((storage: SecureStorageObject) => {
                    storage.remove('refreshToken').then(
                        data => resolve(data),
                        error => reject(error)
                    );
                }).catch(() => {
                    this.storage.remove('refreshToken').then(
                        data => resolve(data),
                        error => reject(error)
                    );
                })
        })
    }

  /**
   * Synchronizes any volatile login information into the secure storage
   * @returns Promise of type any
   */
    private syncSecureStorage(): Promise<any> {
      if (this.getRefreshToken()) {
        return this.setSecureStorageToken(this.getRefreshToken())
          .then(() => {
          return Promise.resolve();
        })
          .catch((error) => {
          return Promise.reject(error);
        })
      } else {
        return this.getSecureStorageToken()
          .then(() => {
          return Promise.resolve();
        })
          .catch(() => {
          return Promise.reject("Synchronization not possible, no refresh token found");
        })
      }
  }

  /**
   * Temporarily stores a resource inside the secure storage. This method is invoked whenever
   * a record is saved but no network connection is present.
   * @param key Key of the resource
   * @param entry The resource to be stored
   */
  private stageResourceForSynchronization(key : string, entry: Resource): Promise<Resource> {
    return new Promise<Resource>((resolve, reject) =>{
      return this.secureStorage.create('UPSTREAM_RECORDS')
        .then((storage: SecureStorageObject) => {
          return storage.set(key, JSON.stringify(entry));
        })
        .then(() => {
          // simply returns the resource passed
          // to this function
          return resolve(entry);
        }).catch((error) => {
          return reject(error);
        })
    });
  }

  /**
   * Event handling function. Gets invoked whenever the network connection was re-established.
   * @param callback Callback function
   */
  private onNetworkConnected(callback : any){
    this.setNetworkState(true); // Network
      return this.getConnection().fetchFHIRConformanceStatement()
        .then(() => {
          return this.refresh();
        })
        .then(() => {
            this.syncResourceMap().catch(() => {
              // synchronize asynchronously.
              // Do not wait for the method to return.
              // However, on error log to console
              console.log("Error during synchronization process!");
            });
          callback(true);
        })
        .catch(() => {
          this.logout();
          callback(false);
        })
  }

  /**
   * Event handling function. Gets invoked whenever the network connection is lost.
   */
  private onNetworkDisconnected() {
    this.setNetworkState(false);
  }

  /**
   * Event handling function. Gets invoked whenever the application is paused.
   * @param callback Callback function
   */
  private onApplicationPaused(callback: any){
    return this.syncSecureStorage()
      .then(() => {
      callback(true);
      })
      .catch(() => {
      callback(false);
      })
  }

  /**
   * Event handling function. Gets invoked whenever the application was resumed.
   * @param callback Callback function
   */
  private onApplicationResumed(callback: any) {
    if (this.getNetworkState()) {
      return this.refresh()
        .then(() => {
        callback(true);
        })
        .catch(() => {
        callback(false);
        });
    } else {
      callback(true);
    }
  }

}
