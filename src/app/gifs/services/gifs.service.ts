import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interface/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private apiKey: string = 'fUMRA5go0BT9zvCr0SzEYuKEGag9TGh9';
  private servicioUrl : string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];


  public resultados: Gif[] = [];



  get historial() {
    return [...this._historial];
  }

  // el HttpClient se importa para poder utilizar https
  constructor(private http: HttpClient) { 
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [] ;// si regresa null , va  adevolver un array vacio []
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];

  }



  buscarGifs(query: string) {
    query = query.trim().toLowerCase();
    if (!this._historial.includes(query)) {

      this._historial.unshift(query);
       //unshift funciona como el add pero ingresa al inicio.
      this._historial = this._historial.splice(0, 10);

      localStorage.setItem("historial", JSON.stringify(this._historial));

    }

    // seteo de parametros para la query
    const params = new HttpParams()
    .set('apikey', this.apiKey)
    .set('limit', '10')
    .set('q', query)


    
    //retorna obserbavles (Propios de RX JS)
    this.http.get<SearchGifsResponse>(`${ this.servicioUrl}/search`,{params: params})
      .subscribe((resp) => {
        console.log(resp.data);
        this.resultados = resp.data;
      localStorage.setItem("resultados", JSON.stringify(this.resultados));

      })





    console.log(this._historial);
  }
}
