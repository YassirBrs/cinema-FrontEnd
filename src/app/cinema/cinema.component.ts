import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CinemaService } from '../services/cinema.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css'],
})
export class CinemaComponent implements OnInit {
  public modalService: NgbModal;
  public villes;
  public cinemas;
  public salles;
  public currentVille;
  public currentSalle;
  public currentCinema;
  public currentProjection;
  public selectedTickets;
  closeResult: string;

  constructor(
    public cinemaService: CinemaService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.onGetVilles();
  }
  onGetVilles() {
    this.cinemaService.getVilles().subscribe(
      (data) => {
        this.villes = data;
      },
      (err) => {
        console.error(err);
      }
    );
  }
  onGetCinemas(ville) {
    this.currentVille = ville;
    this.salles = undefined;
    this.cinemaService.getCinemas(ville).subscribe(
      (data) => {
        this.cinemas = data;
      },
      (err) => {
        console.error(err);
      }
    );
  }
  onGetSalles(cinema) {
    this.currentCinema = cinema;
    this.cinemaService.getSalles(cinema).subscribe(
      (data) => {
        this.salles = data;
        this.salles._embedded.salles.forEach((salle) => {
          this.cinemaService.getProjections(salle).subscribe(
            (data) => {
              salle.projections = data;
            },
            (err) => {
              console.log(err);
            }
          );
        });
      },
      (err) => {
        console.error(err);
      }
    );
  }
  onGetTicketsPlaces(p) {
    // this.open(modal);
    this.currentProjection = p;
    // console.log(p);
    this.cinemaService.getTicketsPlaces(p).subscribe(
      (data) => {
        this.currentProjection.tickets = data;
        this.selectedTickets = [];
      },
      (err) => {
        console.log(err);
      }
    );
  }
  onSelectTicket(t) {
    if (!t.selected) {
      t.selected = true;
      this.selectedTickets.push(t);
    } else {
      t.selected = false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(t), 1);
    }
  }
  getTicketClass(t) {
    let str = 'btn ticket ';
    if (t.reserve == true) {
      str += 'reserve disabled';
    } else if (t.selected) {
      str += 'selected';
    } else {
      str += 'nonreserve';
    }
    return str;
  }
  onPayTickets(form) {
    console.log(form);
    let ticketss = [];
    this.selectedTickets.forEach((t) => {
      ticketss.push(t.id);
    });
    form.tickets = ticketss;
    this.cinemaService.payerTickets(form).subscribe(
      (data) => {
        this.toastr.success('tickets réservés avec Succès !');
        this.onGetTicketsPlaces(this.currentProjection);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
}
