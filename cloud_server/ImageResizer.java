import java.awt.image.BufferedImage;  
import java.io.File;  
import java.io.IOException;
import javax.imageio.ImageIO;
import java.awt.Image;

public class ImageResizer { 
	public static void resizeImage(String srcPath, String desPath,int scaleSize) throws IOException { 
		File srcFile = new File(srcPath); 
		Image srcImg = ImageIO.read(srcFile); 
		BufferedImage bi = null; 
		try { 
			bi = ImageIO.read(srcFile); 
		} catch (Exception e) { 
			e.printStackTrace(); 
		} 
		float width = bi.getWidth();  
		float height = bi.getHeight(); 
		float scale=width/scaleSize; 
		BufferedImage buffImg = null; 
		buffImg = new BufferedImage(scaleSize, (int)(height/scale),BufferedImage.TYPE_INT_RGB);  
		buffImg.getGraphics().drawImage( srcImg.getScaledInstance(scaleSize, (int)(height/scale), Image.SCALE_SMOOTH), 0, 0, null); 
		ImageIO.write(buffImg, "JPEG", new File(desPath)); 
	} 

	public static void main(String []args) throws IOException{ 
		resizeImage("/home/ubuntu/socket/image/1.jpg","/home/ubuntu/socket/test_image/1_1.jpg",32);
	}
}
