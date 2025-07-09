import { Component,OnInit } from '@angular/core';
import { ListingService } from '../../services/listing.service';
@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  data:any;
  constructor(private listing:ListingService){}

  ngOnInit(){
    this.getAllListings();
  }
  getAllListings(){
    this.listing.getListings().subscribe({
      next:(res:any)=>{
        this.data=res.data;
        console.log(this.data);
      },
      error:err=>{
        console.log(err)
      }
    })
  }
}
