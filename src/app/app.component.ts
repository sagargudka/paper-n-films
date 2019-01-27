import { Component, NgModule } from "@angular/core";
import {
  NgbModule,
  NgbCollapseModule,
  NgbCollapse
} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  imports: [NgbModule, NgbCollapseModule, NgbCollapse]
})
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "app";
}
