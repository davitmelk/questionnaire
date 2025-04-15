import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private id: string;
  public updateData = this.socket.fromEvent<any>('updateroom');

  constructor(
    private http: HttpClient,
    private socket: Socket
  ) {}

  public getQuestion(id: string): Observable<any> {
    this.id = id;
    return this.http.get(`${environment.server}/question/${id}`);
  }

  public setAnswer(form): Observable<any> {
    return this.http.post(`${environment.server}/question/${form.question_id}`, form);
  }

  public joinRoom() {
    this.socket.emit('joinroom', this.id);
  }

  public leaveRoom() {
    this.socket.emit('leaveroom', this.id);
  }

  public updateDataRoom() {
    this.socket.emit('updatedataroom', this.id);
  }
}
