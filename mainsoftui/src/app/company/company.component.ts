import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyService } from '../service/company.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Product } from './../interface/product';
import { Company } from './../interface/company';

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
  selectedCompany: Company[] = [];
  selectedProduct: Product[] = [];
  company: any[] = [];
  submittedCompany: boolean = false;
  companyDialog: boolean = false;
  productDialog: boolean = false;
  submitted: boolean = false;

  newCompany: Company = {
    companyName: '',
    nit: '',
    address: '',
    phone: '',
    products: [],
  };

  product: Product = {
    productId: '',
    productName: '',
    description: '',
    image: '',
    quantity: 0,
    price: 0,
  };


  constructor(
    private companyService: CompanyService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
    ) {}

  ngOnInit(): void {
    this.getCompanies();
  }

  getCompanies(){
    this.companyService.getCompanies().subscribe((response: any) => {
      this.companies = response.body;
      this.products = response.body.products; // Assuming the response contains a 'products' property
    });
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
          // this.companies.push(newCompany);

          if (this.product.productName && this.product.description && this.product.image && this.product.quantity && this.product.price) {
            this.newCompany?.products?.push(this.product);
            this.hideCompanyDialog();
          }

          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Company Created', life: 3000 });
          this.hideCompanyDialog();
          this.getCompanies();
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
        // const deletionSubscriptions: Subscription[] = [];

        this.selectedCompany.map(company => {
          console.log('company.nit', company);
          const deletionSubscription = this.companyService.deleteCompany(company.nit).subscribe(
            () => {
              this.companies = this.companies.filter((val) => val.nit !== company.nit);
              this.getCompanies();
            },
            (error) => {
              console.error('Error deleting company:', error);
              // Handle error accordingly, e.g., show error message
            }
          );

          // deletionSubscriptions.push(deletionSubscription);
        });


        this.selectedCompany = [];
        // deletionSubscriptions.forEach((subscription) => subscription.unsubscribe());

        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Company Deleted',
          life: 3000,
        });

      },
    });
  }

  exportPdf() {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((module) => {
        const { default: autoTable } = module;

        const doc = new jsPDF.default('p', 'px', 'a4');

        const nit = this.selectedCompany[0]?.nit || '';
        const companyName = this.selectedCompany[0]?.companyName || '';
        const bodyData: any[] = [];
        const products = this.selectedCompany[0]?.products;

        if (products) {
          products.forEach((product) => {
            bodyData.push({
              productName: product.productName || '',
              description: product.description || '',
              image: product.image || '',
              price: product.price || '',
              quantity: product.quantity || '',
            });
          });
        }

        const columns = [
          { header: 'Product Name', dataKey: 'productName' },
          { header: 'Description', dataKey: 'description' },
          { header: 'Image', dataKey: 'image' },
          { header: 'Price', dataKey: 'price' },
          { header: 'Quantity', dataKey: 'quantity' },
        ];

        const columnStyles: { [key: string]: any } = {
          productName: { cellWidth: 80 },
          description: { cellWidth: 120 },
          image: { cellWidth: 60 },
          price: { cellWidth: 60 },
          quantity: { cellWidth: 60 },
        };

        doc.text(`NIT: ${nit} | Company Name: ${companyName}`, 30, 20);
        autoTable(doc, { columns, body: bodyData, columnStyles });
        doc.save('products.pdf');
      });
    });
  }

  searchGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.table?.filterGlobal(filterValue, 'contains');
  }



  openNewProductDialog() {
    this.productDialog = true;
    this.product = {
      productId: '',
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


  addProduct() {
    try {
      this.submitted = true;

      if (this.product.productName && this.product.quantity && this.product.price) {
        const updatedCompany: Company = {
          ...this.selectedCompany[0], // Copy the selected company
          products: [...(this.selectedCompany[0].products || []), this.product] // Add the new product to the products array
        };

        this.companyService.updateCompany(updatedCompany.nit, updatedCompany).subscribe(
          () => {
            const companyIndex = this.companies.findIndex(company => company.nit === updatedCompany.nit);
            if (companyIndex !== -1) {
              this.companies[companyIndex] = updatedCompany; // Update the company in the companies array
            }

            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Added', life: 3000 });
            this.hideProductDialog();
            this.selectedCompany = [updatedCompany];
            this.selectedProduct = [];
          },
          (error) => {
            console.error('Error updating company:', error);
            // Handle error accordingly, e.g., show error message
          }
        );
      }

    } catch (error) {
      console.log(error);
    }
  }

  editSelectedProduct(){
    this.product = this.selectedProduct[0]
    this.productDialog = true;
  }

  deleteProduct(product: Product) {
    try {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this product?',
        accept: () => {
          const productId = product.productId;
          const updatedProducts = this.selectedCompany[0]?.products?.filter(p => p.productId !== productId);

          if (updatedProducts) {
            const updatedCompany: Company = {
              ...this.selectedCompany[0],
              products: updatedProducts
            };

            this.companyService.updateCompany(updatedCompany.nit, updatedCompany).subscribe(
              () => {
                const companyIndex = this.companies.findIndex(company => company.nit === updatedCompany.nit);
                if (companyIndex !== -1) {
                  this.companies[companyIndex] = updatedCompany;
                }

                this.selectedCompany = [updatedCompany];
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
              },
              (error) => {
                console.error('Error updating company:', error);
                // Handle error accordingly, e.g., show error message
              }
            );
          }

        }
      });

    } catch (error) {
      console.log(error);
    }
  }

}
