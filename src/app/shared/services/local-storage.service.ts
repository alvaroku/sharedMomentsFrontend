import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // Method to save an object to local storage
  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Method to retrieve an object from local storage
  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) as T : null;
  }

  // Method to remove an item from local storage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Method to clear all items from local storage
  clear(): void {
    localStorage.clear();
  }
}
