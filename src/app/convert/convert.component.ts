import {Component, ElementRef, ViewChild} from '@angular/core';
import convert from "xml-js";

@Component({
  selector: 'app-convert',
  standalone: true,
  imports: [],
  templateUrl: './convert.component.html',
  styleUrl: './convert.component.scss'
})
export class ConvertComponent {

  @ViewChild('textarea')
  textArea?: ElementRef<HTMLTextAreaElement>

  async uploadFile(event: Event): Promise<void> {

    if (!this.textArea) {
      throw new Error('No textArea')
    }

    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (!fileList?.length) {
      return;
    }

    const xmlFile = fileList[0]
    const xmlContent = await xmlFile.text()
    const xmlObject = convert.xml2json(xmlContent, {
      compact: true,
    })

    this.textArea.nativeElement.value = xmlObject
  }
}
