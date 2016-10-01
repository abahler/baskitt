describe('Shopping List', function() {
    it('should list items on GET');
    it('should add an item on POST');
    it('should edit an item on PUT');
    it('should delete an item on DELETE');
    
    // *** Custom tests from 'Try It!' section ***
    // Section asks for test for a POST to an ID that doesn't exist, but this doesn't make sense,
    //      as it will exist when it is created.
    it('should respond with a 400 on POST without body data');
    it('should respond with a 400 on POST without valid JSON');
    it('should respond with a 404 on PUT without id in endpoint');
    it('should respond with a 400 on PUT when ids in endpoint and body differ');
    it('should respond with a 404 on PUT with nonexistent id');
    it('should respond with a 400 on PUT without body');
    it('should respond with a 400 to a PUT without valid JSON')
    it('should respond with a 404 to a DELETE on an invalid id');
    it('should respond with a 400 to a DELETE without an id');
});