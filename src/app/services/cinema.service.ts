import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CinemaService {
  public host: string = 'http://localhost:8088';

  constructor(private httpClient: HttpClient) {}
  /**
   * getVilles
   */
  public getVilles() {
    return this.httpClient.get(this.host + '/villes');
  }
  public getCinemas(ville) {
    return this.httpClient.get(ville._links.cinemas.href);
  }
  public getSalles(cinema) {
    return this.httpClient.get(cinema._links.salles.href);
  }
  public getProjections(salle: any) {
    let url = salle._links.projections.href.replace('{?projection}', '');
    return this.httpClient.get(url + '?projection=p1');
  }
  getTicketsPlaces(p) {
    let url = p._links.tickets.href.replace('{?projection}', '');
    return this.httpClient.get(url + '?projection=p2');
  }
  payerTickets(form) {
    return this.httpClient.post(this.host + '/payerTickets', form);
  }
}
