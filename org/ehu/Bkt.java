package org.ehu;
public class Bkt {
   double pl0;
   double plg;
   double plt;
   double pls;
   double pknow = 0;
   public Bkt (){
      this.pl0 = 0.4;
      this.plt = 0.1;
      this.pls = 0.3;
      this.plg = 0.2;
      this.pknow = 0.0;
   }
   public int setParameters (double _l0, double _lt,double _ls,double _lg){
      this.pl0 = _l0;
      this.plt = _lt;
      this.pls = _ls;
      this.plg = _lg;
      this.pknow = 0.0;
      return 1;
   }
   public int updateMastering (boolean correct){
     if (this.pknow ==0.0){
       this.pknow = this.pl0;
     }
     double p_l__actual;
      if (correct){
        System.out.println("correct");
        p_l__actual = (this.pknow* (1-this.pls)) / (this.pknow* (1-this.pls) + (1-this.pknow)*this.plg);
        this.pknow = p_l__actual + ((1-p_l__actual)*this.plt);
      }
      else {
        System.out.println("incorrent");
        p_l__actual = (this.pknow*this.pls) / (this.pknow*this.pls + (1-this.pknow)*(1-this.plg));
        this.pknow = p_l__actual + ((1-p_l__actual)*this.plt);
      }
      System.out.println(this.pknow);
      return 1;
   }
}
