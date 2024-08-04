describe('Report Generator Page', () => {
    beforeEach(() => {
      cy.restoreSession(); 
      cy.visit('http://localhost:5001/report'); 
    });
  
    it('should display report generator components', () => {
      cy.url().should('include', '/report-generator');
  
      cy.get('[data-test=report-generator-header]').should('be.visible');
      cy.get('[data-test=fetch-report-button]').should('be.visible');
      cy.get('[data-test=training-select]').should('be.visible');
      cy.get('[data-test=validity-select]').should('be.visible');
      cy.get('[data-test=generate-report-button]').should('be.visible');
    });
  
    it('should fetch and display skills report data', () => {
      cy.intercept('GET', 'http://localhost:3000/api/skillsReport').as('getSkillsReport');
      
      cy.get('[data-test=fetch-report-button]').click();
  
      cy.wait('@getSkillsReport').then((interception) => {
        expect([200, 304]).to.include(interception.response.statusCode);
      });
  
      cy.get('table').should('be.visible');
      cy.get('table thead tr th').should('have.length', 4);
    });
  
    it('should fetch and display training options', () => {
      cy.intercept('GET', 'http://localhost:3000/api/trainings').as('getTrainings');
      
      cy.wait('@getTrainings').then((interception) => {
        expect([200, 304]).to.include(interception.response.statusCode);
      });
  
      cy.get('[data-test=training-select]').should('exist').within(() => {
        cy.get('option').should('have.length.greaterThan', 1); 
      });
    });
  
    it('should filter report based on selected training and validity', () => {
      cy.intercept('GET', 'http://localhost:3000/api/skillsReport').as('getSkillsReport');
      
      cy.get('[data-test=fetch-report-button]').click();
      cy.wait('@getSkillsReport');
      cy.get('[data-test=training-select]').select('SAFETY AWARENESS (PPE)');
      cy.get('[data-test=validity-select]').select('Valid');
      cy.get('table tbody tr').each(($row) => {
        cy.wrap($row).within(() => {
          cy.get('td').eq(2).should('contain', 'SAFETY AWARENESS (PPE)');
          cy.get('td').eq(3).should('contain', 'Valid');
        });
      });
    });
  
    it('should generate a PDF report', () => {
      cy.get('[data-test=generate-report-button]').click();
      cy.window().document().then((doc) => {
        const pdfBlob = doc.querySelector('iframe')?.src;
        expect(pdfBlob).to.exist;
      });
    });
  });
  