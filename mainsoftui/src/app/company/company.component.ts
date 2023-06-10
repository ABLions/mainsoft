import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyService } from '../service/company.service';
// import { Company } from 'src/model/company.model';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';


interface Product {
  productName?: string;
  description?: string;
  image?: string;
  quantity?: number;
  price?: number;
}

interface Company {
  companyName: string;
  nit: string;
  address?: string;
  phone?: string;
  products?: Product[];
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
  selectedCompany!: Company[];

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
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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
    this.getCompanies();
  }

  getCompanies(){
    this.companyService.getCompanies().subscribe((response: any) => {
      this.companies = response.body;
      this.products = response.body.products; // Assuming the response contains a 'products' property
    });
  }

  saveCompany() {
    this.submittedCompany = true;

    if (this.newCompany.companyName && this.newCompany.nit && this.newCompany.address && this.newCompany.phone) {
      const newCompany = {
        companyName: this.newCompany.companyName,
        nit: this.newCompany.nit,
        address: this.newCompany.address,
        phone: this.newCompany.phone,
        products: []
      };

      // this.companies.push(newCompany);

      this.companyService.createCompany(newCompany).subscribe(
        () => {
          this.companies.push(newCompany);

          if (this.product.productName && this.product.description && this.product.image && this.product.quantity && this.product.price) {
            this.newCompany?.products?.push(this.product);
            this.hideCompanyDialog();
          }

          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Company Created', life: 3000 });
          this.hideCompanyDialog();
        },
        (error) => {
          console.error('Error creating company:', error);
          // Handle error accordingly, e.g., show error message
        }
      );
    }
  }

  editSelectedCompany() {
    this.newCompany = this.selectedCompany[0]
    this.companyDialog = true;
  }

  deleteSelectedCompany() {
    console.log('selectedCompany', this.selectedCompany);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this company?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const deletionSubscriptions: Subscription[] = [];

        this.selectedCompany.map(company => {
          console.log('company.nit', company);
          const deletionSubscription = this.companyService.deleteCompany(company.nit).subscribe(
            () => {
              this.companies = this.companies.filter(
                (val) => val.nit !== company.nit
              );
            },
            (error) => {
              console.error('Error deleting company:', error);
              // Handle error accordingly, e.g., show error message
            }
          );

          deletionSubscriptions.push(deletionSubscription);
        });

        this.selectedCompany = [];

        deletionSubscriptions.forEach((subscription) => subscription.unsubscribe());

        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Company Deleted',
          life: 3000,
        });
        this.getCompanies();
      },
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
        this.companies[companyIndex]?.products?.push(this.product);

        // Save the company to persist the changes
        this.saveCompany();
      }

      this.hideProductDialog();
    }
  }

}
