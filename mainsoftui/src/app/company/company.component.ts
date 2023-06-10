import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyService } from '../service/company.service';
// import { Company } from 'src/model/company.model';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';


interface Product {
  productName: string;
  description: string;
  image: string;
  quantity: number;
  price: number;
}

interface Company {
  companyName: string;
  nit: string;
  address: string;
  phone: string;
  products: Product[];
}


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
  providers: [MessageService, ConfirmationService]
})

export class CompanyComponent implements OnInit {

  @ViewChild('dt', { static: false }) table: Table | undefined;
  companies: Company[] = [];
  exportColumns!: any[];
  products: any[] = [];

  newCompany: Company = {
    companyName: '',
    nit: '',
    address: '',
    phone: '',
    products: [],
  };

  product: Product = {
    productName: '',
    description: '',
    image: '',
    quantity: 0,
    price: 0,
  };

  submittedCompany: boolean = false;
  companyDialog: boolean = false;
  productDialog: boolean = false;
  submitted: boolean = false;

  constructor(
    private companyService: CompanyService,
    private messageService: MessageService
    ) {
    this.exportColumns = [
      { field: 'productName', header: 'Product Name' },
      { field: 'description', header: 'Description' },
      { field: 'image', header: 'Image' },
      { field: 'price', header: 'Price' },
      { field: 'quantity', header: 'Quantity' }
    ];
  }

  ngOnInit(): void {
    this.companyService.getCompanies().subscribe((response: any) => {
      this.companies = response.body;
      this.products = response.body.products; // Assuming the response contains a 'products' property
    });
  }

  exportPdf() {
    import('jspdf').then((jsPDFModule) => {
      import('jspdf-autotable').then((autoTableModule) => {
        const doc = new jsPDFModule.default('p', 'px', 'a4');
        const tableData = [];

        for (const product of this.products) {
          const rowData = [
            product.productName,
            product.description,
            product.image,
            product.price,
            product.quantity
          ];
          tableData.push(rowData);
        }

        const columns = [
          { header: 'Product Name', dataKey: 'productName' },
          { header: 'Description', dataKey: 'description' },
          { header: 'Image', dataKey: 'image' },
          { header: 'Price', dataKey: 'price' },
          { header: 'Quantity', dataKey: 'quantity' }
        ];

        const header = columns.map((column) => column.header);

        (autoTableModule as any).default(doc, {
          head: [header],
          body: tableData
        });

        doc.save('products.pdf');
      });
    });
  }

  searchGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.table?.filterGlobal(filterValue, 'contains');
  }


  saveCompany() {
    this.submittedCompany = true;

    if (this.newCompany.companyName && this.newCompany.nit && this.newCompany.address && this.newCompany.phone) {
      // Perform the logic to save the new company
      // You can access the company data using the this.newCompany object
      const newCompany = {
        companyName: this.newCompany.companyName,
        nit: this.newCompany.nit,
        address: this.newCompany.address,
        phone: this.newCompany.phone,
        products: []
      };
      this.companies.push(newCompany);

      if (this.product.productName && this.product.description && this.product.image && this.product.quantity && this.product.price) {
        // Perform the logic to save the new product
        // You can access the product data using the this.product object

        // After saving the product, you can push it to the existing company's products array
        this.newCompany.products.push(this.product);

        this.hideProductDialog();
      }

      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Company Created', life: 3000 });

      this.hideCompanyDialog();
    }
  }

  openNewCompanyDialog() {
    this.newCompany = {
      companyName: '',
      nit: '',
      address: '',
      phone: '',
      products: []
    };
    this.submittedCompany = false;
    this.companyDialog = true;
  }

  hideCompanyDialog() {
    this.companyDialog = false;
    this.newCompany = {
      companyName: '',
      nit: '',
      address: '',
      phone: '',
      products: []
    };
  }

  openNewProductDialog() {
    this.productDialog = true;
    this.product = {
      productName: '',
      description: '',
      image: '',
      quantity: 0,
      price: 0,
    };
    this.submitted = false;
  }

  hideProductDialog() {
    this.productDialog = false;
  }

  saveProduct() {
    this.submitted = true;

    if (this.product.productName && this.product.description && this.product.image && this.product.quantity && this.product.price) {
      // Perform the logic to save the new product
      // You can access the product data using the this.product object

      // Find the company with the matching NIT in the companies array
      const companyIndex = this.companies.findIndex(company => company.nit === this.newCompany.nit);
      if (companyIndex !== -1) {
        // Push the product to the products array of the found company
        this.companies[companyIndex].products.push(this.product);

        // Save the company to persist the changes
        this.saveCompany();
      }

      this.hideProductDialog();
    }
  }




}
