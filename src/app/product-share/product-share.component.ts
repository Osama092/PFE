import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';



@Component({
  selector: 'app-product-share',
  templateUrl: './product-share.component.html',
  styleUrl: './product-share.component.css'
})
export class ProductShareComponent implements OnInit {
  currentUrl!: string;

  constructor(@Inject(DOCUMENT) private document: Document, private router: Router) { }


  ngOnInit(): void {
    this.currentUrl = window.location.href;
    console.log('Current URL: ' + this.currentUrl);
    console.log('document: ' + this.document.URL)

  }



  shareToFacebook() {
    // Logic to share content on Facebook
    //window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(this.currentUrl), '_blank');
    window.open('http://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href));
  }

  shareToWhatsApp() {
    // Logic to share content on WhatsApp
    window.open('whatsapp://send?text=' + encodeURIComponent(this.currentUrl), '_blank');
  }

  shareToInstagram() {
    // Logic to share content on Instagram
    window.open('https://www.instagram.com/?url=' + encodeURIComponent(this.currentUrl), '_blank');
  }

  copyLink() {
    
  }
}
